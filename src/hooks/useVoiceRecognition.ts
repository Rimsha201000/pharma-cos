import { useState, useEffect, useCallback, useRef } from 'react';

interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
      isFinal: boolean;
    };
    length: number;
  };
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message?: string;
}

interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => ISpeechRecognition;
    webkitSpeechRecognition?: new () => ISpeechRecognition;
  }
}

export type VoiceLanguage = 'en-US' | 'ur-PK';

export function useVoiceRecognition(onTranscript?: (transcript: string, isFinal: boolean) => void) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [language, setLanguage] = useState<VoiceLanguage>('en-US');
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const isListeningRef = useRef(false);
  const errorTimeoutRef = useRef<number | null>(null);

  // Store onTranscript in ref to prevent unnecessary effect re-runs
  const onTranscriptRef = useRef(onTranscript);
  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  const clearErrorTimer = () => {
    if (errorTimeoutRef.current) {
      window.clearTimeout(errorTimeoutRef.current);
      errorTimeoutRef.current = null;
    }
  };

  const setSafeError = (msg: string | null) => {
    clearErrorTimer();
    setError(msg);
    if (msg) {
      errorTimeoutRef.current = window.setTimeout(() => {
        setError(null);
      }, 4000);
    }
  };

  // Initialize Speech Recognition once
  useEffect(() => {
    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionClass) {
      setIsSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language;

      recognition.onstart = () => {
        isListeningRef.current = true;
        setIsListening(true);
        setSafeError(null);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalStr = '';
        let interimStr = '';

        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalStr += result[0].transcript;
          } else {
            interimStr += result[0].transcript;
          }
        }

        if (finalStr) {
          setTranscript(finalStr);
          if (onTranscriptRef.current) {
            onTranscriptRef.current(finalStr, true);
          }
        } else if (interimStr) {
          setInterimTranscript(interimStr);
          if (onTranscriptRef.current) {
            onTranscriptRef.current(interimStr, false);
          }
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        // 'aborted' is a normal event when recognition is stopped by the user or restarted
        if (event.error === 'aborted') {
          isListeningRef.current = false;
          setIsListening(false);
          return;
        }

        console.warn('Speech recognition event error:', event.error);
        if (event.error === 'not-allowed') {
          setSafeError('Microphone permission required. Please click the mic icon in your browser address bar to allow.');
        } else if (event.error === 'no-speech') {
          setSafeError('No speech detected. Please speak into the microphone.');
        } else if (event.error === 'network') {
          setSafeError('Speech service network issue. Please try again.');
        } else {
          setSafeError(`Speech recognition: ${event.error}`);
        }

        isListeningRef.current = false;
        setIsListening(false);
      };

      recognition.onend = () => {
        isListeningRef.current = false;
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (err) {
      console.warn('Failed to initialize speech recognition:', err);
      setIsSupported(false);
    }

    return () => {
      clearErrorTimer();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, []);

  // Update language on existing instance
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = language;
    }
  }, [language]);

  const startListening = useCallback(() => {
    setSafeError(null);
    setTranscript('');
    setInterimTranscript('');

    if (!recognitionRef.current) {
      setSafeError('Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.');
      return;
    }

    // If already active, abort first
    if (isListeningRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
    }

    try {
      recognitionRef.current.lang = language;
      recognitionRef.current.start();
    } catch (e: any) {
      console.warn('Recognition start caught error:', e);
      try {
        recognitionRef.current.stop();
        setTimeout(() => {
          try {
            recognitionRef.current?.start();
          } catch {}
        }, 120);
      } catch {}
    }
  }, [language]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch {}
    isListeningRef.current = false;
    setIsListening(false);
  }, []);

  const toggleLanguage = useCallback((newLang?: VoiceLanguage) => {
    if (newLang) {
      setLanguage(newLang);
    } else {
      setLanguage(prev => (prev === 'en-US' ? 'ur-PK' : 'en-US'));
    }
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    language,
    isSupported,
    error,
    startListening,
    stopListening,
    setLanguage: toggleLanguage
  };
}
