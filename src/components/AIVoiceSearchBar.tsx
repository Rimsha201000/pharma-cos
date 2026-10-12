import React, { useState } from 'react';
import { 
  Search, Mic, MicOff, Globe, Sparkles, X, ArrowRight, 
  Volume2, Check, AlertCircle, ShoppingCart, RefreshCw
} from 'lucide-react';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import { useApp } from '../context/AppContext';
import { askGemini } from '../services/geminiService';

export const AIVoiceSearchBar: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { medicines, cosmetics, sales, suppliers, settings, setCurrentView, addToCart } = useApp();
  const [query, setQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const {
    isListening,
    transcript,
    language,
    startListening,
    stopListening,
    setLanguage,
    error: voiceError
  } = useVoiceRecognition((liveText, isFinal) => {
    setQuery(liveText);
    if (isFinal) {
      handleSearch(liveText);
    }
  });

  // Handle voice transcript updates
  React.useEffect(() => {
    if (transcript) {
      setQuery(transcript);
    }
  }, [transcript]);

  const handleSearch = async (overrideQuery?: string) => {
    const textToSearch = overrideQuery || query;
    if (!textToSearch.trim()) return;

    setIsLoadingAi(true);
    setShowResultModal(true);

    try {
      const response = await askGemini(
        textToSearch,
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
      setAiResponse(response);
    } catch {
      setAiResponse('Unable to complete AI query at this moment.');
    } finally {
      setIsLoadingAi(false);
    }
  };

  const handleSpeechSynthesis = (textToRead: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }

      // Clean markdown tags for clean reading
      const cleanText = textToRead.replace(/[#*`_-]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = language === 'ur-PK' ? 'ur-PK' : 'en-US';
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  // Find matching items from inventory for fast direct jump
  const lowerQ = query.toLowerCase().trim();
  const matchedMeds = lowerQ ? medicines.filter(m => 
    m.name.toLowerCase().includes(lowerQ) || 
    m.genericName.toLowerCase().includes(lowerQ) ||
    m.barcode.includes(lowerQ)
  ).slice(0, 3) : [];

  const matchedCosmetics = lowerQ ? cosmetics.filter(c => 
    c.name.toLowerCase().includes(lowerQ) || 
    c.brand.toLowerCase().includes(lowerQ)
  ).slice(0, 3) : [];

  return (
    <div className={`relative ${compact ? 'w-full max-w-md' : 'w-full max-w-2xl'}`}>
      {/* Search Input Bar */}
      <div className={`relative flex items-center rounded-2xl bg-white/95 backdrop-blur-md border transition-all duration-300 shadow-sm ${
        isListening 
          ? 'border-rose-400 ring-4 ring-rose-100 shadow-rose-100/50' 
          : 'border-slate-200/90 hover:border-teal-400 focus-within:border-teal-500 focus-within:ring-4 focus-within:ring-teal-100'
      }`}>
        <div className="pl-3.5 pr-1.5 text-slate-400 flex items-center">
          <Search className="w-4 h-4 text-teal-600" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder={
            isListening 
              ? (language === 'ur-PK' ? 'بولیں، اردو میں سن رہے ہیں...' : 'Listening in English... speak now')
              : (language === 'ur-PK' ? 'اردو یا انگلش میں سرچ کریں یا مائیک دبائیں...' : 'AI Search medicines, cosmetics, expiry, or ask...')
          }
          dir={language === 'ur-PK' && /[\u0600-\u06FF]/.test(query) ? 'rtl' : 'ltr'}
          className={`w-full py-2.5 px-2 bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none ${
            language === 'ur-PK' ? 'font-urdu text-base' : ''
          }`}
        />

        {query && (
          <button
            onClick={() => setQuery('')}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-full mr-1 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Language Switcher Pill: EN vs UR */}
        <div className="flex items-center border-l border-slate-200 px-1.5 py-1">
          <button
            type="button"
            onClick={() => setLanguage(language === 'en-US' ? 'ur-PK' : 'en-US')}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
              language === 'ur-PK' 
                ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                : 'bg-teal-50 text-teal-700 border border-teal-200'
            }`}
            title="Switch Voice & AI Language (English / Urdu)"
          >
            <Globe className="w-3 h-3" />
            <span>{language === 'ur-PK' ? 'اردو' : 'EN'}</span>
          </button>
        </div>

        {/* Voice Typing Microphone Button */}
        <div className="pr-2 pl-1">
          <button
            type="button"
            onClick={isListening ? stopListening : startListening}
            className={`relative p-2 rounded-xl flex items-center justify-center transition-all ${
              isListening 
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-300 animate-pulse' 
                : 'bg-teal-600 text-white hover:bg-teal-700 shadow-sm hover:shadow'
            }`}
            title={isListening ? 'Stop listening' : `Voice Typing in ${language === 'ur-PK' ? 'Urdu' : 'English'}`}
          >
            {isListening ? (
              <>
                <MicOff className="w-4 h-4 animate-bounce" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                </span>
              </>
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Ask AI Button */}
        <button
          type="button"
          onClick={() => handleSearch()}
          className="mr-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-teal-700 to-teal-800 text-white text-xs font-medium hover:from-teal-800 hover:to-teal-900 shadow-sm flex items-center gap-1 transition-all"
        >
          <Sparkles className="w-3 h-3 text-rose-300" />
          <span className="hidden sm:inline">AI Ask</span>
        </button>
      </div>

      {/* Voice feedback banner if listening */}
      {isListening && (
        <div className="absolute top-full left-0 right-0 mt-2 z-30 p-2.5 rounded-xl bg-slate-900/90 backdrop-blur-md text-white text-xs flex items-center justify-between shadow-xl border border-slate-700 animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span className={language === 'ur-PK' ? 'font-urdu' : ''}>
              {language === 'ur-PK' ? 'اردو میں بولیں، آواز لکھی جا رہی ہے...' : 'Listening... Speak in English to transcribe live'}
            </span>
          </div>
          <button
            onClick={stopListening}
            className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-[11px] font-bold"
          >
            Done
          </button>
        </div>
      )}

      {/* Voice Error Notice (only if non-aborted and not empty) */}
      {voiceError && (
        <div className="absolute top-full left-0 right-0 mt-2 z-30 p-2.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs flex items-center justify-between gap-2 shadow-md animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{voiceError}</span>
          </div>
        </div>
      )}

      {/* Quick Voice Prompt Shortcuts */}
      {!isListening && !query && (
        <div className="hidden xl:flex items-center gap-1.5 mt-1 overflow-x-auto text-[11px] py-0.5">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider shrink-0">Ask:</span>
          <button 
            type="button" 
            onClick={() => { setQuery('Which medicines expire within 30 days?'); handleSearch('Which medicines expire within 30 days?'); }}
            className="px-2 py-0.5 rounded-full bg-white/80 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-slate-600 hover:text-teal-800 transition-colors shrink-0 font-medium"
          >
            Near-expiry meds
          </button>
          <button 
            type="button" 
            onClick={() => { setLanguage('ur-PK'); setQuery('کون سی ادویات اگلے مہینے ایکسپائر ہو رہی ہیں؟'); handleSearch('کون سی ادویات اگلے مہینے ایکسپائر ہو رہی ہیں؟'); }}
            className="px-2 py-0.5 rounded-full bg-white/80 hover:bg-rose-50 border border-slate-200 hover:border-rose-300 text-slate-600 hover:text-rose-800 transition-colors shrink-0 font-urdu"
          >
            ایکسپائر ادویات
          </button>
          <button 
            type="button" 
            onClick={() => { setQuery('Show low stock cosmetics'); handleSearch('Show low stock cosmetics'); }}
            className="px-2 py-0.5 rounded-full bg-white/80 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-slate-600 hover:text-amber-800 transition-colors shrink-0 font-medium"
          >
            Low stock cosmetics
          </button>
          <button 
            type="button" 
            onClick={() => { setQuery('What is today total revenue and profit?'); handleSearch('What is today total revenue and profit?'); }}
            className="px-2 py-0.5 rounded-full bg-white/80 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-600 hover:text-emerald-800 transition-colors shrink-0 font-medium"
          >
            Revenue & profit
          </button>
        </div>
      )}

      {/* Quick Dropdown suggestions / matches if user is typing */}
      {query && !showResultModal && (matchedMeds.length > 0 || matchedCosmetics.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 z-40 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden text-xs">
          <div className="p-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-slate-500 font-semibold">
            <span>Instant Inventory Matches</span>
            <button 
              onClick={() => handleSearch()}
              className="text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              Ask AI Full Analysis <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="p-2 divide-y divide-slate-100 max-h-60 overflow-y-auto">
            {matchedMeds.map(m => (
              <div key={m.id} className="py-2 px-2 hover:bg-teal-50/50 rounded-lg flex items-center justify-between transition-colors">
                <div>
                  <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                    {m.name}
                    {m.prescriptionRequired && (
                      <span className="px-1 py-0.2 rounded bg-rose-100 text-rose-700 text-[10px] font-bold">Rx</span>
                    )}
                    {m.isQuarantined && (
                      <span className="px-1 py-0.2 rounded bg-red-100 text-red-700 text-[10px]">Quarantined</span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {m.genericName} • Stock: <span className={m.quantity <= m.reorderLevel ? 'text-amber-600 font-bold' : 'text-emerald-700 font-medium'}>{m.quantity}</span> • Batch: {m.batchNumber}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-700">{settings.currencySymbol} {m.sellingPrice}</span>
                  <button
                    onClick={() => {
                      addToCart(m, 'MEDICINE');
                      setCurrentView('pos');
                    }}
                    disabled={m.isQuarantined || m.quantity <= 0}
                    className="p-1.5 rounded-lg bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-40"
                    title="Add to POS Cart"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {matchedCosmetics.map(c => (
              <div key={c.id} className="py-2 px-2 hover:bg-rose-50/50 rounded-lg flex items-center justify-between transition-colors">
                <div>
                  <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                    {c.name}
                    {c.shade && <span className="text-slate-500 text-[11px]">({c.shade})</span>}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {c.brand} • {c.category} • Stock: <span className="font-medium text-emerald-700">{c.quantity}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-700">{settings.currencySymbol} {c.sellingPrice}</span>
                  <button
                    onClick={() => {
                      addToCart(c, 'COSMETIC');
                      setCurrentView('pos');
                    }}
                    className="p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700"
                    title="Add to POS Cart"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Detailed Result Modal / Dialog */}
      {showResultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-teal-800 via-teal-700 to-rose-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md">
                  <Sparkles className="w-5 h-5 text-rose-200" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-lg">PharmaGlow AI Business Assistant</h3>
                  <p className="text-xs text-teal-100 flex items-center gap-1.5">
                    <span>Query: "{query}"</span>
                    <span>•</span>
                    <span className="bg-white/20 px-1.5 py-0.2 rounded text-[10px]">
                      {language === 'ur-PK' ? 'اردو' : 'English'}
                    </span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowResultModal(false);
                  if (isSpeaking && 'speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                    setIsSpeaking(false);
                  }
                }}
                className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {isLoadingAi ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full border-4 border-teal-200 border-t-teal-600 animate-spin" />
                    <Sparkles className="w-5 h-5 text-rose-500 absolute inset-0 m-auto animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Consulting AI Knowledge Engine...</h4>
                    <p className="text-xs text-slate-500 mt-1 font-urdu">
                      {language === 'ur-PK' ? 'فارمیسی اور کاسمیٹکس کے لائیو ڈیٹا کا تجزیہ کیا جا رہا ہے...' : 'Analyzing live FEFO inventory, expiry radar, and transactions...'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Action Bar */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="text-xs font-semibold uppercase tracking-wider text-teal-800">
                      Verified Store Intelligence
                    </span>
                    <div className="flex items-center gap-2">
                      {aiResponse && (
                        <button
                          onClick={() => handleSpeechSynthesis(aiResponse)}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                            isSpeaking 
                              ? 'bg-rose-100 text-rose-700 border border-rose-200 animate-pulse' 
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>{isSpeaking ? 'Stop Audio' : 'Listen'}</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleSearch()}
                        className="p-1 rounded-full text-slate-400 hover:text-teal-700 hover:bg-slate-100"
                        title="Refresh analysis"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Render response text */}
                  <div 
                    dir={/[\u0600-\u06FF]/.test(aiResponse || '') ? 'rtl' : 'ltr'}
                    className={`prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed whitespace-pre-wrap ${
                      /[\u0600-\u06FF]/.test(aiResponse || '') ? 'font-urdu text-base leading-loose' : ''
                    }`}
                  >
                    {aiResponse}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                <Check className="w-3.5 h-3.5" /> Live FEFO & Expiry Shield Active
              </span>
              <button
                onClick={() => setShowResultModal(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
