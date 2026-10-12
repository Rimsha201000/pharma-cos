import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, Sparkles, Send, Mic, MicOff, Globe, Volume2, 
  Trash2, Copy, Check, CheckCircle2, AlertTriangle, ArrowRight 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { askGemini } from '../services/geminiService';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  language?: 'en-US' | 'ur-PK';
}

export const AIAssistantView: React.FC = () => {
  const { medicines, cosmetics, sales, suppliers, settings } = useApp();
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: `Hello! I am PharmaGlow's AI Business Assistant. I am directly connected to your live pharmacy and cosmetics database.\n\nYou can ask me questions using English or Urdu (voice or text), such as:\n- "Which medicines will expire within 30 days?"\n- "کون سی ادویات اگلے مہینے ایکسپائر ہو رہی ہیں؟"\n- "Show me cosmetics with low stock"\n- "What is today's total revenue and profit?"\n- "Which supplier has the highest outstanding balance?"`,
      timestamp: new Date().toLocaleTimeString()
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    isListening,
    transcript,
    language,
    startListening,
    stopListening,
    setLanguage
  } = useVoiceRecognition((liveText, isFinal) => {
    setInputQuery(liveText);
    if (isFinal) {
      handleSend(liveText);
    }
  });

  useEffect(() => {
    if (transcript) {
      setInputQuery(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (overrideText?: string) => {
    const textToSend = overrideText || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString(),
      language
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await askGemini(
        textToSend,
        {
          medicines,
          cosmetics,
          sales,
          suppliers,
          currencySymbol: settings.currencySymbol
        },
        settings.geminiApiKey,
        language
      );

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: response,
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: 'Sorry, I encountered an issue processing your query. Please verify your settings or internet connection.',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }

      const cleanText = text.replace(/[#*`_-]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = language === 'ur-PK' ? 'ur-PK' : 'en-US';
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const promptSuggestions = [
    { en: 'Which medicines are expiring within 30 days?', ur: 'کون سی ادویات اگلے 30 دنوں میں ختم ہو رہی ہیں؟' },
    { en: 'Which cosmetics have low stock?', ur: 'کم اسٹاک والی کاسمیٹکس کون سی ہیں؟' },
    { en: "What is today's total revenue and profit?", ur: 'آج کی کل آمدنی اور منافع کتنا ہے؟' },
    { en: 'Which supplier has the highest pending balance?', ur: 'کس سپلائر کے بقایا جات سب سے زیادہ ہیں؟' }
  ];

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
      
      {/* Top Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-teal-800 via-teal-700 to-slate-900 text-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md">
            <Bot className="w-6 h-6 text-rose-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading font-bold text-lg">PharmaGlow Gemini AI Intelligence</h1>
              <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-200 text-[10px] font-bold uppercase tracking-wider border border-teal-400/30">
                Live Data Grounded
              </span>
            </div>
            <p className="text-xs text-teal-100">
              Query clinical FEFO stock, expiry alerts, and business reports in English & اردو
            </p>
          </div>
        </div>

        {/* Language switch & Clear */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLanguage(language === 'en-US' ? 'ur-PK' : 'en-US')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              language === 'ur-PK' 
                ? 'bg-rose-500 text-white shadow-sm' 
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{language === 'ur-PK' ? 'اردو (Urdu)' : 'English (EN)'}</span>
          </button>

          <button
            onClick={() => setMessages(messages.slice(0, 1))}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Suggested Prompts Bar */}
      <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-2 overflow-x-auto text-xs shrink-0">
        <span className="text-slate-400 font-semibold uppercase text-[10px] shrink-0">Suggested:</span>
        {promptSuggestions.map((p, idx) => {
          const text = language === 'ur-PK' ? p.ur : p.en;
          return (
            <button
              key={idx}
              onClick={() => handleSend(text)}
              className={`px-3 py-1 rounded-full bg-white hover:bg-teal-50 hover:text-teal-800 border border-slate-200 text-slate-700 shrink-0 font-medium transition-colors ${
                language === 'ur-PK' ? 'font-urdu' : ''
              }`}
            >
              {text}
            </button>
          );
        })}
      </div>

      {/* Messages Stream */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50">
        {messages.map(msg => {
          const isUser = msg.sender === 'user';
          const isUrduMsg = /[\u0600-\u06FF]/.test(msg.text);

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white text-xs font-bold shadow-xs ${
                isUser ? 'bg-slate-800' : 'bg-gradient-to-tr from-teal-700 to-rose-500'
              }`}>
                {isUser ? 'You' : <Sparkles className="w-4 h-4 text-white" />}
              </div>

              {/* Message Bubble */}
              <div className={`p-4 rounded-3xl shadow-xs text-xs sm:text-sm leading-relaxed ${
                isUser 
                  ? 'bg-slate-900 text-white rounded-tr-none' 
                  : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'
              }`}>
                <div 
                  dir={isUrduMsg ? 'rtl' : 'ltr'}
                  className={`whitespace-pre-wrap ${isUrduMsg ? 'font-urdu text-base leading-loose' : ''}`}
                >
                  {msg.text}
                </div>

                <div className={`mt-2 flex items-center justify-between text-[10px] pt-1.5 border-t ${
                  isUser ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-400'
                }`}>
                  <span>{msg.timestamp}</span>

                  {!isUser && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSpeak(msg.text)}
                        className="hover:text-teal-700 transition-colors"
                        title="Listen to response"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="hover:text-teal-700 transition-colors"
                        title="Copy text"
                      >
                        {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Spinner Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3 max-w-md">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-700 to-rose-500 flex items-center justify-center shrink-0 text-white text-xs shadow-xs animate-pulse">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="p-4 rounded-3xl bg-white border border-slate-200 text-xs text-slate-500 flex items-center gap-2 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-ping" />
              <span>Analyzing live database figures with Gemini...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Chips */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-200/80 flex items-center gap-1.5 overflow-x-auto text-xs shrink-0">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider shrink-0">Quick Queries:</span>
        <button
          type="button"
          onClick={() => handleSend('Which medicines will expire within 30 days?')}
          className="px-2.5 py-1 rounded-full bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-slate-700 hover:text-teal-800 transition-colors shrink-0 font-medium"
        >
          ⏰ Near-Expiry Meds
        </button>
        <button
          type="button"
          onClick={() => { setLanguage('ur-PK'); handleSend('کون سی ادویات اگلے مہینے ایکسپائر ہو رہی ہیں؟'); }}
          className="px-2.5 py-1 rounded-full bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-300 text-slate-700 hover:text-rose-800 transition-colors shrink-0 font-urdu font-medium"
        >
          ⚠️ ایکسپائر ادویات
        </button>
        <button
          type="button"
          onClick={() => handleSend('Show me cosmetics with low stock')}
          className="px-2.5 py-1 rounded-full bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-slate-700 hover:text-amber-800 transition-colors shrink-0 font-medium"
        >
          🧴 Low Stock Cosmetics
        </button>
        <button
          type="button"
          onClick={() => handleSend("What is today's total revenue and profit?")}
          className="px-2.5 py-1 rounded-full bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-800 transition-colors shrink-0 font-medium"
        >
          💰 Revenue & Profit
        </button>
        <button
          type="button"
          onClick={() => handleSend('Which supplier has the highest outstanding balance?')}
          className="px-2.5 py-1 rounded-full bg-white hover:bg-purple-50 border border-slate-200 hover:border-purple-300 text-slate-700 hover:text-purple-800 transition-colors shrink-0 font-medium"
        >
          📦 Supplier Balances
        </button>
      </div>

      {/* Input Bar */}
      <div className="p-4 bg-white border-t border-slate-200 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          {/* Language Switcher Button */}
          <button
            type="button"
            onClick={() => setLanguage(language === 'en-US' ? 'ur-PK' : 'en-US')}
            className={`px-3 py-2.5 rounded-2xl flex items-center gap-1.5 text-xs font-bold transition-all border ${
              language === 'ur-PK'
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-teal-50 text-teal-700 border-teal-200'
            }`}
            title="Toggle between English and Urdu voice/chat"
          >
            <Globe className="w-4 h-4" />
            <span>{language === 'ur-PK' ? 'اردو' : 'EN'}</span>
          </button>

          {/* Voice Mic Button */}
          <button
            type="button"
            onClick={isListening ? stopListening : startListening}
            className={`p-3 rounded-2xl flex items-center justify-center transition-all ${
              isListening 
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-300 animate-pulse' 
                : 'bg-teal-600 hover:bg-teal-700 text-white shadow-md'
            }`}
            title={isListening ? 'Listening... click to stop' : `Voice Typing in ${language === 'ur-PK' ? 'Urdu' : 'English'}`}
          >
            {isListening ? <MicOff className="w-5 h-5 animate-bounce" /> : <Mic className="w-5 h-5 text-white" />}
          </button>

          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            dir={language === 'ur-PK' && /[\u0600-\u06FF]/.test(inputQuery) ? 'rtl' : 'ltr'}
            placeholder={
              isListening 
                ? (language === 'ur-PK' ? 'بولیں، اردو میں سن رہے ہیں...' : 'Listening in English... speak now')
                : (language === 'ur-PK' ? 'اپنا سوال اردو میں لکھیں یا مائیک دبائیں...' : 'Ask about sales, expiry, stock, profits, suppliers...')
            }
            className={`flex-1 py-3 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition-all ${
              language === 'ur-PK' ? 'font-urdu text-base' : ''
            }`}
          />

          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="p-3 rounded-2xl bg-teal-700 hover:bg-teal-800 disabled:opacity-40 text-white transition-all shadow-md"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>

    </div>
  );
};
