import React, { useState } from 'react';
import { 
  User, Lock, Eye, EyeOff, Shield, Sparkles, CheckCircle2, 
  ArrowRight, Key, Heart, Pill, Stethoscope, ShoppingCart, HelpCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INITIAL_USERS } from '../data/initialData';
import { PharmaCosmeticsOrbitBackground } from '../components/PharmaCosmeticsOrbitBackground';
import confetti from 'canvas-confetti';

export const LoginView: React.FC = () => {
  const { setCurrentUser, setCurrentView, addAuditLog } = useApp();
  
  const [activeTab, setActiveTab] = useState<'login' | 'signin'>('login');
  const [email, setEmail] = useState('superadmin@pharmaglow.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle Login submission
  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    setTimeout(() => {
      // Find matching user or fallback to super admin
      const user = INITIAL_USERS.find(
        u => u.email.toLowerCase() === email.trim().toLowerCase()
      ) || INITIAL_USERS[0];

      setCurrentUser(user);
      addAuditLog('LOGIN', 'Auth', `User logged in as ${user.name} (${user.role})`);
      
      // Celebrate with confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#be185d', '#0d9488', '#fbbf24', '#ffffff']
        });
      } catch {}

      setIsLoading(false);
      setCurrentView('dashboard');
    }, 600);
  };

  // Quick 1-click login for demo accounts
  const handleQuickDemo = (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword('admin123');
    setIsLoading(true);
    
    setTimeout(() => {
      const user = INITIAL_USERS.find(u => u.email.toLowerCase() === roleEmail.toLowerCase()) || INITIAL_USERS[0];
      setCurrentUser(user);
      addAuditLog('LOGIN', 'Auth', `Quick demo login as ${user.name} (${user.role})`);
      setIsLoading(false);
      setCurrentView('dashboard');
    }, 400);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* 3D Orbiting Medicines & Cosmetics Background */}
      <PharmaCosmeticsOrbitBackground variant="plum-velvet" showControls />

      {/* Main Luxury Glass Card - Inspired Exactly by Image 1 */}
      <div className="relative z-10 w-full max-w-[880px] bg-white rounded-[28px] sm:rounded-[32px] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.6),0_0_1px_1px_rgba(255,255,255,0.2)] overflow-hidden flex flex-col md:flex-row min-h-[540px] animate-fadeIn">
        
        {/* =========================================================================
            LEFT PANEL: Geometric Layered Folded Origami Ribbon (Plum/Wine/Rose)
            ========================================================================= */}
        <div className="relative md:w-[40%] bg-gradient-to-br from-[#831843] via-[#701a40] to-[#500724] p-6 sm:p-8 flex flex-col justify-between overflow-hidden select-none">
          
          {/* Layered Geometric Origami Ribbons */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Fold Layer 1 (Dark plum) */}
            <div 
              className="absolute -top-12 -left-12 w-64 h-80 bg-[#701a40] rotate-[35deg] shadow-2xl opacity-90"
              style={{ clipPath: 'polygon(0 0, 100% 0, 60% 100%, 0% 100%)' }}
            />
            {/* Fold Layer 2 (Rich berry) */}
            <div 
              className="absolute top-10 -left-16 w-80 h-96 bg-[#9d174d] rotate-[25deg] shadow-[0_15px_35px_rgba(0,0,0,0.35)] opacity-85"
              style={{ clipPath: 'polygon(0 0, 100% 15%, 85% 100%, 0% 100%)' }}
            />
            {/* Fold Layer 3 (Rose pink highlight) */}
            <div 
              className="absolute top-36 -left-10 w-72 h-80 bg-[#be185d] rotate-[15deg] shadow-[0_20px_40px_rgba(0,0,0,0.4)] opacity-75"
              style={{ clipPath: 'polygon(0 0, 95% 0, 75% 100%, 0% 85%)' }}
            />
            {/* Fold Layer 4 (Soft blush accent) */}
            <div 
              className="absolute -bottom-16 -left-8 w-80 h-64 bg-[#db2777] rotate-[-10deg] opacity-60"
            />
          </div>

          {/* Left Header Brand Info */}
          <div className="relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md border border-white/25 flex items-center justify-center p-1 shadow-inner">
                <img src="/pharmaglow-logo.png" alt="PharmaGlow Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="font-heading font-black text-xl text-white tracking-wide">
                  Pharma<span className="text-pink-300">Glow</span>
                </span>
                <span className="block text-[9px] uppercase tracking-widest text-pink-200/80 font-medium">
                  Pharmacy & Cosmetics
                </span>
              </div>
            </div>
          </div>

          {/* Tab Switcher: Protruding Pill Design (Matching Image 1) */}
          <div className="relative z-20 my-10 space-y-4">
            
            {/* LOGIN TAB (Protruding Pill into Right Panel) */}
            <div className="relative">
              {activeTab === 'login' ? (
                <div className="relative -mr-6 md:-mr-8 flex items-center justify-end">
                  {/* Protruding White Pill */}
                  <button
                    onClick={() => setActiveTab('login')}
                    className="relative bg-white text-[#831843] font-heading font-extrabold text-sm tracking-wider px-8 py-3.5 rounded-l-full shadow-[-8px_4px_20px_rgba(0,0,0,0.25)] flex items-center gap-2 transition-all"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#be185d] animate-ping" />
                    <span>LOGIN</span>
                  </button>

                  {/* Top Concave Notch Curve */}
                  <div 
                    className="hidden md:block absolute -top-5 right-0 w-5 h-5 bg-transparent pointer-events-none"
                    style={{
                      borderBottomRightRadius: '20px',
                      boxShadow: '8px 8px 0 0 #ffffff'
                    }}
                  />
                  {/* Bottom Concave Notch Curve */}
                  <div 
                    className="hidden md:block absolute -bottom-5 right-0 w-5 h-5 bg-transparent pointer-events-none"
                    style={{
                      borderTopRightRadius: '20px',
                      boxShadow: '8px -8px 0 0 #ffffff'
                    }}
                  />
                </div>
              ) : (
                <button
                  onClick={() => setActiveTab('login')}
                  className="w-full text-left px-5 py-2.5 text-pink-100 hover:text-white font-heading font-bold text-sm tracking-wider uppercase transition-colors flex items-center gap-2"
                >
                  <span className="opacity-70">LOGIN</span>
                </button>
              )}
            </div>

            {/* SIGN IN / DEMO ACCESS TAB */}
            <div className="relative">
              {activeTab === 'signin' ? (
                <div className="relative -mr-6 md:-mr-8 flex items-center justify-end">
                  <button
                    onClick={() => setActiveTab('signin')}
                    className="relative bg-white text-[#831843] font-heading font-extrabold text-sm tracking-wider px-8 py-3.5 rounded-l-full shadow-[-8px_4px_20px_rgba(0,0,0,0.25)] flex items-center gap-2 transition-all"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#be185d] animate-ping" />
                    <span>DEMO ACCESS</span>
                  </button>

                  {/* Top Concave Notch Curve */}
                  <div 
                    className="hidden md:block absolute -top-5 right-0 w-5 h-5 bg-transparent pointer-events-none"
                    style={{
                      borderBottomRightRadius: '20px',
                      boxShadow: '8px 8px 0 0 #ffffff'
                    }}
                  />
                  {/* Bottom Concave Notch Curve */}
                  <div 
                    className="hidden md:block absolute -bottom-5 right-0 w-5 h-5 bg-transparent pointer-events-none"
                    style={{
                      borderTopRightRadius: '20px',
                      boxShadow: '8px -8px 0 0 #ffffff'
                    }}
                  />
                </div>
              ) : (
                <button
                  onClick={() => setActiveTab('signin')}
                  className="w-full text-left px-5 py-2.5 text-pink-200 hover:text-white font-heading font-bold text-sm tracking-wider uppercase transition-colors flex items-center gap-2"
                >
                  <span className="opacity-80">SIGN IN</span>
                </button>
              )}
            </div>
          </div>

          {/* Left Footer System Security Note */}
          <div className="relative z-10 text-[11px] text-pink-200/75 flex items-center gap-2">
            <Shield className="w-4 h-4 text-pink-300 shrink-0" />
            <span>FEFO Certified & Rx Encrypted</span>
          </div>
        </div>

        {/* =========================================================================
            RIGHT PANEL: Crisp Porcelain White Form with 3D Avatar & 3D Buttons
            ========================================================================= */}
        <div className="relative md:w-[60%] bg-white p-8 sm:p-12 flex flex-col justify-between">
          
          {activeTab === 'login' ? (
            /* Standard Login Form matching Image 1 */
            <form onSubmit={handleLogin} className="space-y-6">
              
              {/* Top Circular 3D Avatar Badge */}
              <div className="flex flex-col items-center text-center">
                <div className="relative group">
                  {/* Outer 3D Glow Ring */}
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#701a40] via-[#9d174d] to-[#be185d] p-1 shadow-[0_10px_25px_-5px_rgba(157,23,77,0.45)] flex items-center justify-center">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-[#831843] to-[#500724] flex items-center justify-center text-white border-2 border-white/30">
                      <User className="w-9 h-9 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
                    </div>
                  </div>
                  {/* Little Status Glow Dot */}
                  <span className="absolute bottom-0 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-xs" />
                </div>

                <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#701a40] tracking-wider mt-3">
                  LOGIN
                </h2>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  Enter your credentials to access the management portal
                </p>
              </div>

              {/* Error Message if any */}
              {errorMessage && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium text-center animate-shake">
                  {errorMessage}
                </div>
              )}

              {/* Underlined Minimalist Inputs (Matching Image 1) */}
              <div className="space-y-5 pt-2">
                {/* Email Field */}
                <div className="relative group">
                  <div className="flex items-center gap-3 pb-2 border-b-2 border-slate-200 group-focus-within:border-[#9d174d] transition-colors">
                    <User className="w-5 h-5 text-slate-400 group-focus-within:text-[#9d174d] transition-colors" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email or Username"
                      required
                      className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden font-medium"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="relative group">
                  <div className="flex items-center gap-3 pb-2 border-b-2 border-slate-200 group-focus-within:border-[#9d174d] transition-colors">
                    <Lock className="w-5 h-5 text-slate-400 group-focus-within:text-[#9d174d] transition-colors" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      required
                      className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-[#9d174d] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Forgot Password link */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => alert('Demo Mode: Use password "admin123" for all pre-configured accounts.')}
                    className="text-xs text-[#9d174d] hover:text-[#701a40] font-semibold hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>

              {/* 3D Tactile LOGIN Button (Centered / Full Width Pill) */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-3d btn-3d-plum px-10 py-3 text-sm tracking-wider uppercase font-extrabold shadow-lg"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Authenticating...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <span>LOGIN</span>
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Quick Demo Access View */
            <div className="space-y-5">
              <div className="text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-pink-100 text-[#831843] flex items-center justify-center font-bold text-xl mb-2">
                  ⚡
                </div>
                <h3 className="font-heading font-black text-xl text-[#701a40]">
                  Instant Role-Based Access
                </h3>
                <p className="text-xs text-slate-500">
                  Select a role below to explore tailored permissions immediately.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                {[
                  { role: 'Super Admin', email: 'superadmin@pharmaglow.com', desc: 'Full Master Access', icon: Shield, color: 'border-teal-300 bg-teal-50/50 hover:bg-teal-50' },
                  { role: 'Pharmacist', email: 'pharmacist@pharmaglow.com', desc: 'FEFO & Rx Checks', icon: Pill, color: 'border-rose-300 bg-rose-50/50 hover:bg-rose-50' },
                  { role: 'Inventory Mgr', email: 'inventory@pharmaglow.com', desc: 'Batches & Suppliers', icon: Stethoscope, color: 'border-amber-300 bg-amber-50/50 hover:bg-amber-50' },
                  { role: 'POS Cashier', email: 'cashier@pharmaglow.com', desc: 'Sales & Receipts', icon: ShoppingCart, color: 'border-purple-300 bg-purple-50/50 hover:bg-purple-50' },
                ].map((item) => (
                  <button
                    key={item.email}
                    onClick={() => handleQuickDemo(item.email)}
                    className={`p-3 rounded-2xl border text-left transition-all hover:scale-[1.02] shadow-xs ${item.color}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <item.icon className="w-4 h-4 text-[#831843]" />
                      <span className="text-[10px] font-bold text-[#831843] uppercase">Demo</span>
                    </div>
                    <div className="font-bold text-xs text-slate-800">{item.role}</div>
                    <div className="text-[10px] text-slate-500">{item.desc}</div>
                  </button>
                ))}
              </div>

              <div className="text-center pt-2">
                <button
                  onClick={() => setActiveTab('login')}
                  className="text-xs text-[#9d174d] font-bold hover:underline"
                >
                  &larr; Back to Standard Login
                </button>
              </div>
            </div>
          )}

          {/* Bottom "Or Login With" Social & Demo Bar (Matching Image 1) */}
          <div className="pt-6 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
              <span className="font-medium text-slate-400">Or Login With</span>
              <div className="flex items-center gap-3">
                {/* Google Button */}
                <button
                  type="button"
                  onClick={() => handleQuickDemo('superadmin@pharmaglow.com')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors font-medium text-slate-700"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Google</span>
                </button>

                {/* Facebook Button */}
                <button
                  type="button"
                  onClick={() => handleQuickDemo('pharmacist@pharmaglow.com')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors font-medium text-slate-700"
                >
                  <svg className="w-3.5 h-3.5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Facebook</span>
                </button>

                {/* Direct Landing Page Link */}
                <button
                  type="button"
                  onClick={() => setCurrentView('landing')}
                  className="text-xs text-slate-400 hover:text-slate-600 underline ml-1"
                >
                  View Showcase
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
