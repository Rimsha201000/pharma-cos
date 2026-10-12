import React, { useState } from 'react';
import { Sparkles, Mail, Check, Code2 } from 'lucide-react';

export const Watermark: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const email = 'rimsha201000@gmail.com';

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <aside 
      aria-label="Developer Credits"
      className="fixed bottom-3 right-3 z-40 select-none group pointer-events-auto"
    >
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-md hover:shadow-lg transition-all duration-300 text-xs font-medium text-slate-700 hover:border-teal-400">
        <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-teal-600 to-rose-400 flex items-center justify-center text-white text-[10px] shadow-sm animate-pulse">
          <Sparkles className="w-3 h-3" />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-slate-800">
            Developed by <span className="text-teal-700">Rimsha</span>
          </span>
          <span className="text-slate-300">|</span>
          <a 
            href={`mailto:${email}`}
            className="flex items-center gap-1 text-slate-600 hover:text-rose-600 transition-colors"
            title="Send Email"
          >
            <Mail className="w-3 h-3 text-slate-400 group-hover:text-rose-500" />
            <span className="hidden sm:inline">{email}</span>
            <span className="sm:hidden">Email</span>
          </a>
          <button
            onClick={handleCopy}
            className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-teal-600 transition-colors"
            title="Copy email to clipboard"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Code2 className="w-3 h-3" />}
          </button>
        </div>
      </div>
    </aside>
  );
};
