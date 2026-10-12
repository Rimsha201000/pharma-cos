import React, { useState } from 'react';
import { 
  Sparkles, ArrowRight, ShieldCheck, Pill, ShoppingCart, 
  Bot, Clock, Heart, CheckCircle2, ChevronRight, Activity, 
  Flame, Lock, Award, Zap, Layers, Globe, Star
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

export const LandingPage: React.FC = () => {
  const { setCurrentView, switchRole, medicines, cosmetics, settings } = useApp();
  const [activeTab, setActiveTab] = useState<'pharmacy' | 'cosmetics' | 'ai'>('pharmacy');

  const demoRoles: { role: UserRole; title: string; desc: string; color: string }[] = [
    { role: 'SUPER_ADMIN', title: 'Super Admin', desc: 'Enterprise master control, audits & governance', color: 'from-teal-600 to-teal-800' },
    { role: 'PHARMACIST', title: 'Pharmacist', desc: 'Rx checks, FEFO dispensing & cold-chain safety', color: 'from-rose-500 to-rose-700' },
    { role: 'INVENTORY_MANAGER', title: 'Inventory Manager', desc: 'Batches, receiving, supplier POs & radar alerts', color: 'from-amber-600 to-amber-800' },
    { role: 'CASHIER', title: 'POS Cashier', desc: 'Lightning billing, loyalty & receipt printing', color: 'from-emerald-600 to-emerald-800' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-800 selection:bg-teal-500 selection:text-white overflow-hidden">
      
      {/* Background Decorative Ambient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none -z-10 animate-float" />
      <div className="absolute top-40 right-10 w-80 h-80 bg-rose-400/10 rounded-full blur-3xl pointer-events-none -z-10 animate-float-delay" />
      <div className="absolute top-[800px] left-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Copy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 border border-teal-200/80 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-ping" />
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-800">
                Next-Gen Healthcare & Beauty ERP
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-xs text-rose-600 font-medium flex items-center gap-1 font-urdu">
                <Globe className="w-3 h-3" /> Voice Typing English & اردو
              </span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
              Elevating <span className="text-teal-700">Pharmacy</span> Care & <span className="gradient-text">Cosmetic Elegance</span> with AI.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed mx-auto lg:mx-0">
              PharmaGlow unites clinical-grade pharmaceutical dispensing (FEFO batch tracking, Rx checks, cold chain safety) with luxury cosmetic retail, lightning POS billing, and intelligent dual-language voice management.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <button
                onClick={() => setCurrentView('login')}
                className="btn-3d btn-3d-plum px-7 py-3.5 text-white font-bold text-sm shadow-xl flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>Portal Login</span>
              </button>

              <button
                onClick={() => setCurrentView('dashboard')}
                className="btn-3d btn-3d-warm px-6 py-3.5 text-white font-bold text-sm shadow-lg flex items-center gap-2 group"
              >
                <span>Enterprise Dashboard</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setCurrentView('pos')}
                className="btn-3d btn-3d-porcelain px-5 py-3.5 text-slate-800 font-bold text-sm flex items-center gap-2"
              >
                <ShoppingCart className="w-4 h-4 text-[#c2784d]" />
                <span>Rapid POS</span>
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200/80 max-w-md mx-auto lg:mx-0">
              <div>
                <div className="font-heading font-extrabold text-2xl text-teal-800">100%</div>
                <div className="text-xs text-slate-500 font-medium">FEFO Batch Safety</div>
              </div>
              <div>
                <div className="font-heading font-extrabold text-2xl text-rose-600">Dual-Voice</div>
                <div className="text-xs text-slate-500 font-medium">English & اردو AI</div>
              </div>
              <div>
                <div className="font-heading font-extrabold text-2xl text-slate-900">0.4s</div>
                <div className="text-xs text-slate-500 font-medium">POS Thermal Bill</div>
              </div>
            </div>
          </div>

          {/* Hero Right: 3D Logo Showcase with floating pills & badges */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            
            {/* Ambient Backing Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/20 via-rose-300/20 to-purple-400/20 rounded-3xl blur-2xl transform rotate-3" />

            {/* Main Interactive 3D Card */}
            <div className="relative w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/80 overflow-hidden group">
              
              {/* Official 3D Logo Showcase */}
              <div className="relative aspect-square max-h-72 w-full mx-auto rounded-2xl bg-gradient-to-b from-slate-50 to-teal-50/30 p-4 flex items-center justify-center border border-slate-100 shadow-inner">
                <img
                  src="/pharmaglow-logo.png"
                  alt="PharmaGlow Logo"
                  className="w-full h-full object-contain filter drop-shadow-xl group-hover:scale-105 transition-transform duration-500"
                />

                {/* Floating Capsule Badge */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-teal-200/80 shadow-md flex items-center gap-1.5 text-xs font-bold text-teal-800 animate-float">
                  <Pill className="w-3.5 h-3.5 text-teal-600" />
                  <span>Clinical FEFO</span>
                </div>

                {/* Floating Beauty Glow Badge */}
                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-rose-200/80 shadow-md flex items-center gap-1.5 text-xs font-bold text-rose-700 animate-float-delay">
                  <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                  <span>Luxury Cosmetics</span>
                </div>
              </div>

              {/* Live Status Ticker */}
              <div className="mt-5 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Live Active Inventory:</span>
                  <span className="font-bold text-teal-800">{medicines.length} Medicines + {cosmetics.length} Cosmetics</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                  <div className="bg-teal-600 h-full w-[65%]" title="Medicines" />
                  <div className="bg-rose-500 h-full w-[35%]" title="Cosmetics" />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-teal-600" /> Pharma Stock</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" /> Beauty Catalog</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 1-Click Role Switcher Demo Bar */}
      <section className="py-8 bg-slate-900 text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h2 className="font-heading text-lg font-bold text-teal-300">
                Explore Role-Based Access Control (RBAC)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Click any role below to instantly experience the interface with tailored permissions:
              </p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-teal-900/80 text-teal-200 border border-teal-700">
              6 Pre-Configured Verified Roles
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4">
            {demoRoles.map(item => (
              <button
                key={item.role}
                onClick={() => {
                  switchRole(item.role);
                  setCurrentView('dashboard');
                }}
                className="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:border-teal-400 text-left transition-all duration-200 group flex items-start justify-between"
              >
                <div>
                  <div className="font-semibold text-sm text-slate-100 group-hover:text-teal-300 transition-colors flex items-center gap-1.5">
                    <span>{item.title}</span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                    {item.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Pillars: Interactive Showcase */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Enterprise Architecture
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
            Engineered for Modern Healthcare & Cosmetics
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Seamlessly combining drug compliance, beauty shade management, real-time expiry radar, and bilingual artificial intelligence.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Card 1: FEFO Pharmacy Dispensing */}
          <div className="p-7 rounded-3xl bg-white border border-slate-200/90 shadow-lg hover:shadow-xl transition-all group relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Pill className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-xl text-slate-900">
              FEFO Pharmaceutical Dispensing
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
              Automated First-Expired, First-Out queueing. Prioritizes near-expiry batches to minimize clinical losses while verifying physician prescription (Rx) requirements.
            </p>
            <ul className="mt-4 space-y-2 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Batch-level expiry countdown
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Cold-chain storage temperature logs
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Mandatory Rx doctor tracking
              </li>
            </ul>
          </div>

          {/* Card 2: Luxury Cosmetics Catalog */}
          <div className="p-7 rounded-3xl bg-white border border-slate-200/90 shadow-lg hover:shadow-xl transition-all group relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-xl text-slate-900">
              Cosmetics & Shades Matrix
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
              Curate skincare, haircare, fragrances, and makeup. Track shade codes, volume sizes, Period After Opening (PAO) markers, and promotional discount campaigns.
            </p>
            <ul className="mt-4 space-y-2 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-600" /> Swatch color & shade identification
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-600" /> PAO (Period-After-Opening) tracking
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-600" /> Promotional discount engine
              </li>
            </ul>
          </div>

          {/* Card 3: Bilingual Voice AI */}
          <div className="p-7 rounded-3xl bg-white border border-slate-200/90 shadow-lg hover:shadow-xl transition-all group relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-xl text-slate-900">
              Bilingual Voice AI (English & اردو)
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
              Tap the microphone to speak questions in English or Urdu. Gemini AI inspects stock, reports expiring medicines, calculates daily revenue, and reads answers aloud.
            </p>
            <ul className="mt-4 space-y-2 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-600" /> Web Speech API with real-time audio wave
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-600" /> Native Urdu (اردو) typography support
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-600" /> Google Gemini generative reasoning
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* Expiry Radar Preview Section */}
      <section className="py-16 bg-gradient-to-r from-teal-900 via-slate-900 to-slate-950 text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold">
                <Clock className="w-3.5 h-3.5" /> Zero-Tolerance Expiry Sentinel
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
                Never Dispense an Expired Drug Again.
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                PharmaGlow's real-time radar categorizes inventory into Critical (&lt;30 days), Approaching (&lt;90 days), and Expired tiers. One-click Quarantine strictly blocks hazardous batches from the Point of Sale.
              </p>
              
              <div className="pt-2 flex gap-4">
                <button
                  onClick={() => setCurrentView('expiry')}
                  className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-lg transition-all"
                >
                  View Expiry Radar Live
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700/80 backdrop-blur-xl space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-700">
                  <span>Batch Safety Status</span>
                  <span>Compliance Action</span>
                </div>

                <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/50 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-red-300 text-sm">Brufen DS Suspension (Batch BRU-22M15)</div>
                    <div className="text-xs text-red-400">Expired 5 days ago • 14 units</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-red-800 text-red-100 font-bold text-xs uppercase">
                    Quarantined / Prohibited
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/50 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-amber-200 text-sm">Ventolin Inhaler 100mcg (Batch VEN-23X12)</div>
                    <div className="text-xs text-amber-400">Expires in 18 days • 12 units</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-amber-700 text-amber-100 font-bold text-xs">
                    FEFO Priority Sale
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-teal-950/40 border border-teal-800/50 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-teal-200 text-sm">Augmentin 625mg (Batch AUG-24B01)</div>
                    <div className="text-xs text-teal-400">Expires in 420 days • 85 units</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-teal-800 text-teal-100 font-bold text-xs">
                    Healthy Batch
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Final Ribbon */}
      <section className="py-16 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h2 className="font-heading text-3xl font-bold text-slate-900">
          Ready to Experience PharmaGlow?
        </h2>
        <p className="text-slate-600 text-sm mt-2 max-w-lg mx-auto">
          Start exploring all modules, manage stock, execute POS sales, and test voice typing in English & Urdu now.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="px-8 py-3.5 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-sm shadow-xl transition-all"
          >
            Enter Management Dashboard
          </button>
        </div>
      </section>

      {/* Landing Footer */}
      <footer className="border-t border-slate-200 py-10 bg-slate-50 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/pharmaglow-logo.png" alt="PharmaGlow" className="w-6 h-6 object-contain" />
            <span className="font-bold text-slate-800 font-heading">PharmaGlow</span>
            <span>— Healthcare & Cosmetics Enterprise Management</span>
          </div>

          <div className="text-center sm:text-right font-medium">
            Developed by <span className="text-teal-700 font-semibold">Rimsha</span> •{' '}
            <a href="mailto:rimsha201000@gmail.com" className="text-rose-600 hover:underline">
              rimsha201000@gmail.com
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
};
