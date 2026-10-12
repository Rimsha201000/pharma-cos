import React, { useState, useEffect } from 'react';

interface OrbitBackgroundProps {
  variant?: 'plum-velvet' | 'warm-luxury' | 'clinical-light';
  showControls?: boolean;
}

export const PharmaCosmeticsOrbitBackground: React.FC<OrbitBackgroundProps> = ({ 
  variant = 'plum-velvet',
  showControls = false 
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 20; // -10px to +10px
      const y = (e.clientY / innerHeight - 0.5) * 20;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const getBackgroundStyles = () => {
    switch (variant) {
      case 'plum-velvet':
        return 'bg-gradient-to-br from-[#3b0826] via-[#4a0d2e] to-[#260517] text-white';
      case 'warm-luxury':
        return 'bg-gradient-to-br from-[#FAF7F2] via-[#F5EFEB] to-[#EFE6DB] text-slate-900';
      case 'clinical-light':
      default:
        return 'bg-gradient-to-br from-slate-50 via-teal-50/30 to-rose-50/30 text-slate-800';
    }
  };

  return (
    <div 
      className={`fixed inset-0 overflow-hidden pointer-events-none select-none z-0 ${getBackgroundStyles()}`}
      style={{
        perspective: '1200px',
      }}
    >
      {/* Ambient Lighting Orbs */}
      <div 
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none opacity-40 transition-transform duration-700 ease-out"
        style={{
          background: variant === 'plum-velvet' 
            ? 'radial-gradient(circle, #be185d 0%, transparent 70%)'
            : 'radial-gradient(circle, #c2784d 0%, transparent 70%)',
          transform: `translate3d(${mousePos.x * 1.5}px, ${mousePos.y * 1.5}px, 0)`,
        }}
      />
      <div 
        className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] rounded-full blur-[100px] pointer-events-none opacity-30 transition-transform duration-700 ease-out"
        style={{
          background: variant === 'plum-velvet'
            ? 'radial-gradient(circle, #701a75 0%, transparent 70%)'
            : 'radial-gradient(circle, #0d9488 0%, transparent 70%)',
          transform: `translate3d(${-mousePos.x * 1.2}px, ${-mousePos.y * 1.2}px, 0)`,
        }}
      />

      {/* Decorative Grid / Geometry Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(circle, ${variant === 'plum-velvet' ? '#ffffff' : '#000000'} 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Central Interactive 3D Orbital Stage */}
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transform: `rotateX(${15 + mousePos.y * 0.4}deg) rotateY(${mousePos.x * 0.4}deg)`,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.2s cubic-bezier(0.1, 0.9, 0.2, 1)',
        }}
      >
        {/* Orbital Ring 1: Primary Ellipse */}
        <div 
          className="absolute w-[580px] h-[580px] rounded-full border border-pink-500/15 pointer-events-none"
          style={{
            boxShadow: variant === 'plum-velvet' 
              ? '0 0 40px rgba(236, 72, 153, 0.1), inset 0 0 40px rgba(236, 72, 153, 0.05)'
              : '0 0 30px rgba(194, 120, 77, 0.1), inset 0 0 30px rgba(194, 120, 77, 0.05)',
            transform: 'rotateX(68deg) rotateZ(-25deg)',
          }}
        />

        {/* Orbital Ring 2: Secondary Ellipse */}
        <div 
          className="absolute w-[820px] h-[820px] rounded-full border border-teal-400/15 pointer-events-none"
          style={{
            boxShadow: '0 0 50px rgba(13, 148, 136, 0.08), inset 0 0 50px rgba(13, 148, 136, 0.04)',
            transform: 'rotateX(72deg) rotateZ(35deg)',
          }}
        />

        {/* Orbit Path 1 Animation Container: Revolving Medicine Capsule & Serum Bottle */}
        <div 
          className={`absolute w-0 h-0 flex items-center justify-center ${isPaused ? '' : 'animate-orbit-1'}`}
          style={{ '--orbit-radius': '290px' } as React.CSSProperties}
        >
          {/* ORBITING ITEM 1: 3D Dual-Tone Medicine Capsule */}
          <div className="relative group animate-capsule-tumble">
            <svg width="68" height="68" viewBox="0 0 100 100" className="drop-shadow-[0_12px_24px_rgba(225,29,72,0.45)]">
              <defs>
                <linearGradient id="capsuleRed" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ff4d6d" />
                  <stop offset="60%" stopColor="#c9184a" />
                  <stop offset="100%" stopColor="#800f2f" />
                </linearGradient>
                <linearGradient id="capsuleWhite" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="70%" stopColor="#f1f5f9" />
                  <stop offset="100%" stopColor="#cbd5e1" />
                </linearGradient>
                <linearGradient id="glossHighlight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>
              </defs>
              <g transform="rotate(-35 50 50)">
                {/* Red Half */}
                <path d="M30,50 L30,32 A20,20 0 0,1 70,32 L70,50 Z" fill="url(#capsuleRed)" />
                {/* Center Band Line */}
                <line x1="30" y1="50" x2="70" y2="50" stroke="#500724" strokeWidth="1.5" />
                {/* White Half */}
                <path d="M30,50 L30,68 A20,20 0 0,0 70,68 L70,50 Z" fill="url(#capsuleWhite)" />
                {/* Specular Longitudinal Reflection */}
                <path d="M36,25 Q35,50 36,75" stroke="url(#glossHighlight)" strokeWidth="4" strokeLinecap="round" />
                {/* Micro Rx Cross Insignia */}
                <path d="M50,34 L50,42 M46,38 L54,38" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
              </g>
            </svg>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] font-bold text-rose-200 border border-rose-500/30 opacity-0 group-hover:opacity-100 transition-opacity">
              FEFO Rx Batch
            </div>
          </div>
        </div>

        {/* Orbit Path 1 Counter-Position: Revolving Luxury Serum Bottle */}
        <div 
          className={`absolute w-0 h-0 flex items-center justify-center ${isPaused ? '' : 'animate-orbit-1'}`}
          style={{ 
            '--orbit-radius': '-290px',
            animationDelay: '-11s'
          } as React.CSSProperties}
        >
          {/* ORBITING ITEM 2: Luxury Cosmetic Serum Dropper Bottle */}
          <div className="relative group animate-serum-pulse">
            <svg width="72" height="72" viewBox="0 0 100 100" className="drop-shadow-[0_12px_26px_rgba(226,120,85,0.45)]">
              <defs>
                <linearGradient id="goldCap" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="50%" stopColor="#d97706" />
                  <stop offset="100%" stopColor="#78350f" />
                </linearGradient>
                <linearGradient id="glassBody" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#fed7aa" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#fb923c" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#ea580c" stopOpacity="0.9" />
                </linearGradient>
              </defs>
              <g transform="rotate(12 50 50)">
                {/* Dropper Rubber Bulb */}
                <path d="M45,10 C45,6 55,6 55,10 L54,16 L46,16 Z" fill="#475569" />
                {/* Gold Collar Ring */}
                <rect x="42" y="16" width="16" height="8" rx="2" fill="url(#goldCap)" stroke="#78350f" strokeWidth="0.5" />
                {/* Bottle Neck */}
                <rect x="44" y="24" width="12" height="6" fill="#f8fafc" opacity="0.8" />
                {/* Luxury Glass Flacon Body */}
                <rect x="34" y="30" width="32" height="52" rx="10" fill="url(#glassBody)" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
                {/* Serum Fill Line & Dropper Pipette inside */}
                <line x1="50" y1="24" x2="50" y2="70" stroke="#fef08a" strokeWidth="2" strokeDasharray="3 2" />
                {/* Golden Label */}
                <rect x="38" y="46" width="24" height="20" rx="3" fill="#ffffff" opacity="0.95" />
                <line x1="41" y1="52" x2="59" y2="52" stroke="#c2784d" strokeWidth="1.5" />
                <line x1="43" y1="58" x2="57" y2="58" stroke="#94a3b8" strokeWidth="1" />
                {/* Specular Highlight Glare */}
                <path d="M37,34 L37,78" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
              </g>
            </svg>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] font-bold text-amber-200 border border-amber-500/30 opacity-0 group-hover:opacity-100 transition-opacity">
              Luxury Glow Serum
            </div>
          </div>
        </div>

        {/* Orbit Path 2 Animation Container: Medicine Tablet & Cosmetic Lipstick */}
        <div 
          className={`absolute w-0 h-0 flex items-center justify-center ${isPaused ? '' : 'animate-orbit-2'}`}
          style={{ '--orbit-radius': '410px' } as React.CSSProperties}
        >
          {/* ORBITING ITEM 3: 3D Embossed Clinical Medicine Tablet */}
          <div className="relative group animate-spin-3d">
            <svg width="60" height="60" viewBox="0 0 100 100" className="drop-shadow-[0_10px_20px_rgba(13,148,136,0.4)]">
              <defs>
                <radialGradient id="tabletBevel" cx="35%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="65%" stopColor="#ccfbf1" />
                  <stop offset="100%" stopColor="#0f766e" />
                </radialGradient>
              </defs>
              <circle cx="50" cy="50" r="38" fill="url(#tabletBevel)" stroke="#ffffff" strokeWidth="2" />
              {/* Score Line */}
              <line x1="22" y1="50" x2="78" y2="50" stroke="#0f766e" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
              {/* Embossed Ring */}
              <circle cx="50" cy="50" r="28" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.6" />
            </svg>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] font-bold text-teal-200 border border-teal-500/30 opacity-0 group-hover:opacity-100 transition-opacity">
              Clinical Tablet
            </div>
          </div>
        </div>

        {/* Orbit Path 2 Counter-Position: Cosmetic Lipstick & Rose Petal */}
        <div 
          className={`absolute w-0 h-0 flex items-center justify-center ${isPaused ? '' : 'animate-orbit-2'}`}
          style={{ 
            '--orbit-radius': '-410px',
            animationDelay: '-15s'
          } as React.CSSProperties}
        >
          {/* ORBITING ITEM 4: Luxury Rose-Gold Lipstick Tube */}
          <div className="relative group animate-serum-pulse">
            <svg width="58" height="58" viewBox="0 0 100 100" className="drop-shadow-[0_10px_22px_rgba(219,39,119,0.4)]">
              <defs>
                <linearGradient id="roseGold" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#fbcfe8" />
                  <stop offset="50%" stopColor="#f472b6" />
                  <stop offset="100%" stopColor="#831843" />
                </linearGradient>
                <linearGradient id="lipstickBullet" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#fda4af" />
                  <stop offset="60%" stopColor="#e11d48" />
                  <stop offset="100%" stopColor="#881337" />
                </linearGradient>
              </defs>
              <g transform="rotate(-25 50 50)">
                {/* Base Case */}
                <rect x="38" y="52" width="24" height="38" rx="4" fill="url(#roseGold)" stroke="#ffffff" strokeWidth="1" />
                {/* Gold Inner Collar */}
                <rect x="41" y="44" width="18" height="8" fill="#fde047" stroke="#ca8a04" strokeWidth="0.5" />
                {/* Beveled Lipstick Bullet */}
                <path d="M42,44 L42,30 Q42,20 50,15 L58,26 L58,44 Z" fill="url(#lipstickBullet)" />
                {/* Specular Shine */}
                <path d="M44,48 L44,85" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
              </g>
            </svg>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] font-bold text-pink-200 border border-pink-500/30 opacity-0 group-hover:opacity-100 transition-opacity">
              Velvet Matte Shade
            </div>
          </div>
        </div>

        {/* Orbit Path 3: Molecular Hexagon Ring (Benzene / Chemical Node) */}
        <div 
          className={`absolute w-0 h-0 flex items-center justify-center ${isPaused ? '' : 'animate-orbit-fast'}`}
          style={{ 
            '--orbit-radius': '200px',
            animationDelay: '-7s'
          } as React.CSSProperties}
        >
          <div className="relative group">
            <svg width="48" height="48" viewBox="0 0 100 100" className="drop-shadow-[0_0_16px_rgba(56,189,248,0.5)]">
              <polygon points="50,15 80,32 80,68 50,85 20,68 20,32" fill="none" stroke="#38bdf8" strokeWidth="3" opacity="0.8" />
              <circle cx="50" cy="15" r="5" fill="#ffffff" />
              <circle cx="80" cy="32" r="5" fill="#38bdf8" />
              <circle cx="80" cy="68" r="5" fill="#38bdf8" />
              <circle cx="50" cy="85" r="5" fill="#ffffff" />
              <circle cx="20" cy="68" r="5" fill="#38bdf8" />
              <circle cx="20" cy="32" r="5" fill="#38bdf8" />
              <circle cx="50" cy="50" r="16" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 3" />
            </svg>
          </div>
        </div>
      </div>

      {/* Floating Botanical Leaves, Rose Petals & Sparkling Dust */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating Petal 1 */}
        <div 
          className="absolute top-[18%] left-[12%] animate-gentle-drift opacity-60"
          style={{ animationDuration: '9s' }}
        >
          <svg width="28" height="28" viewBox="0 0 40 40">
            <path d="M10,30 Q10,10 30,10 Q30,30 10,30 Z" fill="url(#capsuleRed)" opacity="0.6" />
          </svg>
        </div>

        {/* Floating Petal 2 */}
        <div 
          className="absolute bottom-[22%] right-[15%] animate-gentle-drift opacity-60"
          style={{ animationDuration: '12s', animationDelay: '-4s' }}
        >
          <svg width="24" height="24" viewBox="0 0 40 40">
            <path d="M10,30 Q10,10 30,10 Q30,30 10,30 Z" fill="#f43f5e" opacity="0.5" />
          </svg>
        </div>

        {/* Floating Golden Sparkle 1 */}
        <div className="absolute top-[35%] right-[22%] animate-pulse-glow">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#fbbf24">
            <path d="M12,2 L14,9 L21,11 L14,13 L12,20 L10,13 L3,11 L10,9 Z" />
          </svg>
        </div>

        {/* Floating Golden Sparkle 2 */}
        <div className="absolute bottom-[30%] left-[20%] animate-pulse-glow" style={{ animationDelay: '1.5s' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#f472b6">
            <path d="M12,2 L14,9 L21,11 L14,13 L12,20 L10,13 L3,11 L10,9 Z" />
          </svg>
        </div>
      </div>

      {/* Optional Interactive Controls Bar */}
      {showControls && (
        <div className="absolute bottom-4 left-6 pointer-events-auto z-20 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs text-white/80">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
          <span>3D Pharma & Cosmetics Orbit</span>
          <button 
            onClick={() => setIsPaused(!isPaused)}
            className="ml-2 px-2 py-0.5 rounded bg-white/20 hover:bg-white/30 text-[10px] font-bold"
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>
        </div>
      )}
    </div>
  );
};
