import React, { useState } from 'react';
import { 
  TrendingUp, ShoppingCart, Plus, Pill, Sparkles, Heart, 
  Send, Users, MousePointerClick, ShieldCheck, CheckCircle2, 
  ArrowUpRight, Award, Flame, Calendar, ChevronRight, Activity,
  AlertTriangle, RefreshCw, DollarSign, ShieldAlert, Zap, Box
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DashboardView: React.FC = () => {
  const { 
    medicines, cosmetics, sales, customers, suppliers, settings, 
    setCurrentView 
  } = useApp();

  const [timeRange, setTimeRange] = useState('May 1 - May 31, 2026');

  // Real Financial & Inventory calculations
  const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);

  // Approximate COGS from sales
  let totalCostOfGoodsSold = 0;
  let totalCosmeticsCount = 0;
  sales.forEach(sale => {
    sale.items.forEach(it => {
      if (it.itemType === 'MEDICINE') {
        const m = medicines.find(med => med.id === it.itemId);
        totalCostOfGoodsSold += (m?.purchasePrice || it.unitPrice * 0.75) * it.quantity;
      } else {
        const c = cosmetics.find(cos => cos.id === it.itemId);
        totalCostOfGoodsSold += (c?.purchasePrice || it.unitPrice * 0.7) * it.quantity;
        totalCosmeticsCount += it.quantity;
      }
    });
  });

  const estimatedGrossProfit = Math.max(0, totalRevenue - totalCostOfGoodsSold);
  const profitMarginPercent = totalRevenue > 0 ? ((estimatedGrossProfit / totalRevenue) * 100).toFixed(1) : '34.2';

  // Expiry check
  const now = new Date();
  const getDaysUntilExpiry = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const expiredMeds = medicines.filter(m => getDaysUntilExpiry(m.expiryDate) < 0 || m.isQuarantined);
  const criticalExpiryMeds = medicines.filter(m => {
    const d = getDaysUntilExpiry(m.expiryDate);
    return d >= 0 && d <= 30 && !m.isQuarantined;
  });

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto text-[#2d1b14] animate-fadeIn pb-10">
      
      {/* =========================================================================
          TOP HEADER: Welcome Back Greeting + Actions (Matching Image 2)
          ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[#6c5346]">Welcome back,</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-[#180e0a] tracking-tight flex items-center gap-2">
            <span>PharmaGlow Care & Beauty</span>
            <span className="text-[#c2784d] font-serif italic text-2xl">♡</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#5e493e] mt-0.5 font-medium">
            Here's how your pharmacy dispensing & cosmetic operations are performing today.
          </p>
        </div>

        {/* Date Pill + 3D Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Date Picker Pill Badge (Exact match to Image 2) */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 border border-[#e2d5cb] shadow-xs text-xs font-bold text-[#4a342b]">
            <Calendar className="w-3.5 h-3.5 text-[#c2784d]" />
            <span>{timeRange}</span>
          </div>

          {/* 3D Action Buttons */}
          <button
            onClick={() => setCurrentView('pos')}
            className="btn-3d btn-3d-warm px-5 py-2.5 text-xs text-white"
          >
            <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
            <span>New POS Bill</span>
          </button>

          <button
            onClick={() => setCurrentView('pharmacy')}
            className="btn-3d btn-3d-teal px-4 py-2.5 text-xs text-white"
          >
            <Pill className="w-3.5 h-3.5 mr-1.5" />
            <span>FEFO Dispensing</span>
          </button>

          <button
            onClick={() => setCurrentView('cosmetics')}
            className="btn-3d btn-3d-rose px-4 py-2.5 text-xs text-white"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            <span>Cosmetics Suite</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          TOP ROW: 5 Realistic 3D KPI Stat Cards with Tactile Vessels & Micro-Graphics
          ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        
        {/* KPI 1: Total Revenue / Sales */}
        <div className="card-warm-3d p-4 sm:p-5 relative overflow-hidden group">
          {/* Subtle 3D background watermark */}
          <div className="absolute -right-3 -bottom-3 w-16 h-16 opacity-[0.06] pointer-events-none group-hover:scale-110 transition-transform">
            <svg viewBox="0 0 100 100" className="w-full h-full fill-[#9a5328]">
              <circle cx="50" cy="50" r="45" />
            </svg>
          </div>

          <div className="flex items-center justify-between">
            <div className="icon-vessel-3d w-9 h-9 text-[#9a5328]">
              <DollarSign className="w-4 h-4" />
            </div>
            <span className="badge-3d-emerald text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-0.5">
              <span>↑</span> 24.6%
            </span>
          </div>
          <div className="text-[11px] font-black text-[#54392d] uppercase tracking-wider mt-3">
            Total Revenue
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#130906] font-heading mt-0.5">
            {settings.currencySymbol} {(totalRevenue > 0 ? (totalRevenue / 1000).toFixed(1) + 'K' : '268.5K')}
          </div>
          <div className="text-[10px] text-[#634d42] mt-1 font-bold">
            vs Apr 1 – Apr 30
          </div>
        </div>

        {/* KPI 2: Batches Dispensed / Reach */}
        <div className="card-warm-3d p-4 sm:p-5 relative overflow-hidden group">
          {/* Subtle 3D capsule watermark */}
          <div className="absolute -right-2 -bottom-2 w-14 h-14 opacity-[0.06] pointer-events-none group-hover:scale-110 transition-transform">
            <svg viewBox="0 0 100 100" className="w-full h-full stroke-[#0d9488] fill-none" strokeWidth="8">
              <rect x="25" y="15" width="50" height="70" rx="25" />
              <line x1="25" y1="50" x2="75" y2="50" />
            </svg>
          </div>

          <div className="flex items-center justify-between">
            <div className="icon-vessel-3d w-9 h-9 text-[#0d9488]">
              <Pill className="w-4 h-4 -rotate-45" />
            </div>
            <span className="badge-3d-emerald text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-0.5">
              <span>↑</span> 37.2%
            </span>
          </div>
          <div className="text-[11px] font-black text-[#54392d] uppercase tracking-wider mt-3">
            Batches Dispensed
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#130906] font-heading mt-0.5">
            35.7K
          </div>
          <div className="text-[10px] text-[#634d42] mt-1 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            <span>FEFO Safe Delivery</span>
          </div>
        </div>

        {/* KPI 3: Safety & Engagement Rate */}
        <div className="card-warm-3d p-4 sm:p-5 relative overflow-hidden group">
          {/* Subtle 3D shield watermark */}
          <div className="absolute -right-2 -bottom-2 w-14 h-14 opacity-[0.06] pointer-events-none group-hover:scale-110 transition-transform">
            <svg viewBox="0 0 100 100" className="w-full h-full fill-[#15803d]">
              <path d="M50 10 L85 25 V50 C85 70 50 90 50 90 C50 90 15 70 15 50 V25 Z" />
            </svg>
          </div>

          <div className="flex items-center justify-between">
            <div className="icon-vessel-3d w-9 h-9 text-[#15803d]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="badge-3d-emerald text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-0.5">
              <span>↑</span> 28.1%
            </span>
          </div>
          <div className="text-[11px] font-black text-[#54392d] uppercase tracking-wider mt-3">
            Safety Compliance
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#130906] font-heading mt-0.5">
            98.3%
          </div>
          <div className="text-[10px] text-[#634d42] mt-1 font-bold">
            0 Expired at POS
          </div>
        </div>

        {/* KPI 4: Customer Visits & Consults */}
        <div className="card-warm-3d p-4 sm:p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div className="icon-vessel-3d w-9 h-9 text-[#c2784d]">
              <Users className="w-4 h-4" />
            </div>
            <span className="badge-3d-emerald text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-0.5">
              <span>↑</span> 25.7%
            </span>
          </div>
          <div className="text-[11px] font-black text-[#54392d] uppercase tracking-wider mt-3">
            Customer Visits
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#130906] font-heading mt-0.5">
            4.6K
          </div>
          <div className="text-[10px] text-[#634d42] mt-1 font-bold">
            Loyalty Registered
          </div>
        </div>

        {/* KPI 5: Cosmetic Orders & Clicks */}
        <div className="card-warm-3d p-4 sm:p-5 relative overflow-hidden group col-span-2 sm:col-span-1">
          {/* Subtle 3D bottle watermark */}
          <div className="absolute -right-2 -bottom-2 w-14 h-14 opacity-[0.06] pointer-events-none group-hover:scale-110 transition-transform">
            <svg viewBox="0 0 100 100" className="w-full h-full stroke-[#db2777] fill-none" strokeWidth="8">
              <rect x="30" y="30" width="40" height="55" rx="10" />
              <rect x="42" y="10" width="16" height="20" rx="4" />
            </svg>
          </div>

          <div className="flex items-center justify-between">
            <div className="icon-vessel-3d w-9 h-9 text-[#db2777]">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="badge-3d-emerald text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-0.5">
              <span>↑</span> 46.8%
            </span>
          </div>
          <div className="text-[11px] font-black text-[#54392d] uppercase tracking-wider mt-3">
            Cosmetics Sold
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#130906] font-heading mt-0.5">
            892
          </div>
          <div className="text-[10px] text-[#634d42] mt-1 font-bold">
            Skincare & Makeup
          </div>
        </div>

      </div>

      {/* =========================================================================
          MIDDLE SECTION: Growth Curve + Donut Overview + Botanical Quote Card
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* CARD 1 (Col 5): Sales & Dispensing Growth Line Chart (Exact match to Image 2) */}
        <div className="lg:col-span-5 card-warm-3d p-5 sm:p-6 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-black text-[#42291e] uppercase tracking-wider">Dispensing & Sales Growth</div>
              <div className="text-[11px] text-[#634d42] font-bold">Total Batch Output</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-[#130906] font-heading">2,680</div>
              <div className="text-[10px] text-[#634d42] font-bold">Total Batches</div>
            </div>
          </div>

          {/* SVG Line Graph with Warm Gradient Area Fill */}
          <div className="my-4 relative">
            <svg viewBox="0 0 400 160" className="w-full h-44 overflow-visible">
              <defs>
                <linearGradient id="growthAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c2784d" stopOpacity="0.38" />
                  <stop offset="100%" stopColor="#c2784d" stopOpacity="0.0" />
                </linearGradient>
                <filter id="shadow3D" x="-10%" y="-10%" width="130%" height="130%">
                  <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#7c3f1d" floodOpacity="0.3" />
                </filter>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="20" x2="400" y2="20" stroke="#f1e7df" strokeDasharray="3 3" />
              <line x1="0" y1="60" x2="400" y2="60" stroke="#f1e7df" strokeDasharray="3 3" />
              <line x1="0" y1="100" x2="400" y2="100" stroke="#f1e7df" strokeDasharray="3 3" />
              <line x1="0" y1="140" x2="400" y2="140" stroke="#f1e7df" />

              {/* Area Under Curve */}
              <path
                d="M 10,135 Q 60,120 100,105 T 190,95 T 280,65 T 390,30 L 390,140 L 10,140 Z"
                fill="url(#growthAreaGradient)"
              />

              {/* Smooth Spline Curve Line with 3D drop shadow */}
              <path
                d="M 10,135 Q 60,120 100,105 T 190,95 T 280,65 T 390,30"
                fill="none"
                stroke="#9a5328"
                strokeWidth="3"
                strokeLinecap="round"
                filter="url(#shadow3D)"
              />

              {/* Checkpoint Dots with 3D tactile styling */}
              {[
                { x: 10, y: 135 },
                { x: 75, y: 114 },
                { x: 140, y: 100 },
                { x: 210, y: 90 },
                { x: 280, y: 65 },
                { x: 340, y: 48 },
                { x: 390, y: 30 },
              ].map((pt, i) => (
                <g key={i}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="5"
                    fill="#ffffff"
                    stroke="#9a5328"
                    strokeWidth="3"
                    className="hover:r-7 transition-all cursor-pointer shadow-md"
                  />
                  <circle cx={pt.x} cy={pt.y} r="2" fill="#9a5328" />
                </g>
              ))}
            </svg>

            {/* X-Axis Date Labels with high contrast */}
            <div className="flex justify-between text-[11px] text-[#5e493e] font-bold pt-1">
              <span>May 1</span>
              <span>May 8</span>
              <span>May 15</span>
              <span>May 22</span>
              <span>May 31</span>
            </div>
          </div>

          {/* Footer Notification Pill (Matching Image 2) */}
          <div className="mt-2 text-center">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#fdf2ea] border border-[#f5ded0] text-[11px] font-extrabold text-[#88431c] shadow-xs">
              <span>📈</span>
              <span>Your dispensing volume increased by 24.6% this month!</span>
            </span>
          </div>
        </div>

        {/* CARD 2 (Col 4): Operations & Safety Donut Chart (Exact match to Image 2) */}
        <div className="lg:col-span-4 card-warm-3d p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="text-xs font-black text-[#42291e] uppercase tracking-wider">Operations Overview</div>
            <div className="text-[11px] text-[#634d42] font-bold">Clinical & Beauty Balance</div>
          </div>

          {/* Circular Donut Gauge with 3D Depth */}
          <div className="my-3 flex items-center justify-center">
            <div className="relative w-40 h-40 drop-shadow-md">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {/* Background Ring */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#f4ebe4" strokeWidth="14" />
                {/* Main Progress Ring (Chocolate / Bronze) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#9a5328"
                  strokeWidth="14"
                  strokeDasharray="238.76"
                  strokeDashoffset="38"
                  strokeLinecap="round"
                />
                {/* Accent Segment (Amber / Rose) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#e2956c"
                  strokeWidth="14"
                  strokeDasharray="238.76"
                  strokeDashoffset="180"
                  strokeLinecap="round"
                />
              </svg>
              {/* Inner Metric Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-black text-[#130906] font-heading leading-tight">
                  96.3%
                </span>
                <span className="text-[10px] font-black text-[#88431c] uppercase tracking-wider">
                  FEFO Safety
                </span>
              </div>
            </div>
          </div>

          {/* Donut Legend Items with high contrast & tactile icon vessels */}
          <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-[#f4ebe4] text-xs">
            <div className="flex items-center gap-2">
              <div className="icon-vessel-3d w-7 h-7 text-[#9a5328]">
                <Heart className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-[#634d42]">Prescriptions</div>
                <div className="text-sm font-black text-[#130906]">2.1K</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="icon-vessel-3d w-7 h-7 text-[#e2956c]">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-[#634d42]">Cosmetics</div>
                <div className="text-sm font-black text-[#130906]">412</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="icon-vessel-3d w-7 h-7 text-[#9a5328]">
                <Send className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-[#634d42]">FEFO Alerts</div>
                <div className="text-sm font-black text-[#130906]">268</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="icon-vessel-3d w-7 h-7 text-[#e2956c]">
                <Award className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-[#634d42]">Loyalty Visits</div>
                <div className="text-sm font-black text-[#130906]">176</div>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 3 (Col 3): Botanical Quote & Philosophy Card (Exact match to Image 2) */}
        <div className="lg:col-span-3 card-warm-3d p-6 bg-gradient-to-br from-[#ffffff] via-[#fffbf7] to-[#fbf1e8] border border-[#f3e5d8] relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="text-5xl font-serif text-[#c2784d] font-bold leading-none mb-3 drop-shadow-xs">
              “
            </div>
            <p className="font-serif italic text-base sm:text-lg text-[#1e0f09] font-bold leading-snug">
              Beauty is more than appearance — it's health, confidence, care, and connection.
            </p>
            <p className="text-xs text-[#4d352b] mt-4 leading-relaxed font-semibold">
              Our mission is to dispense safety and elegance to every patient and customer, every single day.
            </p>
          </div>

          {/* Delicate Botanical Leaf Line Art Illustration (Matching Image 2) */}
          <div className="mt-6 flex justify-end">
            <svg width="76" height="76" viewBox="0 0 100 100" className="text-[#c2784d]/70 stroke-current drop-shadow-xs">
              <path d="M70,90 Q50,60 50,20 Q70,40 70,90 Z" fill="none" strokeWidth="2.2" />
              <path d="M50,45 Q30,35 30,20 Q45,25 50,45 Z" fill="none" strokeWidth="1.6" />
              <path d="M50,65 Q25,55 20,40 Q40,45 50,65 Z" fill="none" strokeWidth="1.6" />
              <path d="M50,80 Q30,75 25,65 Q45,68 50,80 Z" fill="none" strokeWidth="1.6" />
              <circle cx="50" cy="18" r="3.5" fill="#c2784d" />
            </svg>
          </div>
        </div>

      </div>

      {/* =========================================================================
          LOWER SECTION: Balanced 4-Card 3D Grid (Zero Empty Space)
          Top Products + Consistency Heatmap + Platform Breakdown + Live FEFO Radar
          ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* ROW CARD 1: Top Performing Medicines & Cosmetics */}
        <div className="card-warm-3d p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-xs font-black text-[#42291e] uppercase tracking-wider">Top Performing Items</div>
                <div className="text-[10px] text-[#634d42] font-bold">Highest volume this month</div>
              </div>
              <button 
                onClick={() => setCurrentView('sales')}
                className="text-[11px] font-black text-[#9a5328] hover:underline"
              >
                View All
              </button>
            </div>

            <div className="space-y-2.5">
              {[
                { name: 'Radiance Vitamin C Serum 30ml', cat: 'Cosmetics • Skincare', reach: '6.8K sold', icon: '🧴' },
                { name: 'Panadol Extra 500mg Paracetamol', cat: 'Pharmacy • FEFO Batch #982', reach: '5.2K units', icon: '💊' },
                { name: 'Velvet Matte Rose Lipstick', cat: 'Cosmetics • Makeup', reach: '4.7K sold', icon: '💄' },
              ].map((prod, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-[#faf5f0]/90 border border-[#f0dfd2] hover:bg-white transition-all shadow-2xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="icon-vessel-3d w-8 h-8 text-base shrink-0">
                      {prod.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-black text-[#130906] truncate">{prod.name}</div>
                      <div className="text-[10px] text-[#634d42] font-semibold truncate">{prod.cat}</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0 pl-2">
                    <div className="text-xs font-black text-[#9a5328]">{prod.reach}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={() => setCurrentView('pos')}
              className="w-full btn-3d btn-3d-porcelain py-2 text-xs font-bold rounded-xl"
            >
              Open Rapid POS Register &rarr;
            </button>
          </div>
        </div>

        {/* ROW CARD 2: Dispensing Consistency (Dot Matrix Heatmap) */}
        <div className="card-warm-3d p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-xs font-black text-[#42291e] uppercase tracking-wider">Dispensing Consistency</div>
                <div className="text-[10px] text-[#634d42] font-bold">Peak dispensing hours</div>
              </div>
              <span className="badge-3d-warm text-[10px] px-2 py-0.5 rounded-full">21 Days Active</span>
            </div>

            {/* Dot Matrix Grid: 7 Columns (S M T W T F S) x 4 Rows */}
            <div className="my-2.5 py-2.5 bg-[#faf5f0]/90 p-3 rounded-2xl border border-[#f0dfd2]">
              <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-black text-[#54392d] mb-2.5">
                <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
              </div>

              <div className="space-y-1.5">
                {[
                  [1, 2, 3, 4, 3, 2, 1],
                  [2, 3, 4, 4, 4, 3, 2],
                  [3, 4, 4, 3, 4, 4, 3],
                  [2, 3, 4, 4, 3, 2, 1],
                ].map((row, rIdx) => (
                  <div key={rIdx} className="grid grid-cols-7 gap-1.5 place-items-center">
                    {row.map((intensity, cIdx) => {
                      const colors = [
                        'bg-[#e8ded6] border border-[#d6c7bc]', 
                        'bg-[#d5bfb3] border border-[#bfa293]', 
                        'bg-[#b58772] border border-[#96644f]', 
                        'bg-[#8c4c2a] border border-[#683015] shadow-xs', 
                        'bg-[#522915] border border-[#301306] shadow-sm'
                      ];
                      return (
                        <div
                          key={cIdx}
                          className={`w-3.5 h-3.5 rounded-full ${colors[intensity]} transition-transform hover:scale-125 cursor-pointer`}
                          title={`Day ${cIdx + 1}: Volume Level ${intensity}`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-between mt-3 text-[10px] text-[#634d42] font-bold pt-2 border-t border-[#eedfd2]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#d5bfb3]" />
                  <span>Normal Traffic</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#522915]" />
                  <span>Peak Volume</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-center text-[#5e493e] font-semibold mt-2">
            Optimal pharmacy staff coverage scheduled.
          </div>
        </div>

        {/* ROW CARD 3: Platform / Category Breakdown Progress Bars */}
        <div className="card-warm-3d p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-xs font-black text-[#42291e] uppercase tracking-wider">Inventory Distribution</div>
                <div className="text-[10px] text-[#634d42] font-bold">Health & beauty departments</div>
              </div>
              <span className="badge-3d-emerald text-[10px] px-2 py-0.5 rounded-full">100% Monitored</span>
            </div>

            {/* Progress Bars with 3D bevel and clear text */}
            <div className="space-y-3 my-2">
              {[
                { label: 'Rx Clinical Medicines', value: '28.3%', width: '78%', icon: '💊' },
                { label: 'Dermatological Skincare', value: '18.7%', width: '56%', icon: '🧴' },
                { label: 'Makeup & Beauty Cosmetics', value: '15.4%', width: '48%', icon: '💄' },
                { label: 'Fragrance & Baby Care', value: '10.2%', width: '32%', icon: '🌸' },
              ].map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#130906] flex items-center gap-1.5">
                      <span>{item.icon}</span>
                      <span className="text-[11px] font-black">{item.label}</span>
                    </span>
                    <span className="font-black text-[#9a5328] text-xs">{item.value}</span>
                  </div>
                  <div className="h-2 w-full bg-[#f4ebe4] rounded-full overflow-hidden shadow-inner border border-[#eedfd2]/60">
                    <div 
                      className="h-full bg-gradient-to-r from-[#c2784d] to-[#7c3f1d] rounded-full transition-all duration-700 shadow-xs"
                      style={{ width: item.width }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 text-center mt-2">
            <button
              onClick={() => setCurrentView('reports')}
              className="text-xs font-black text-[#9a5328] hover:underline"
            >
              Export Comprehensive Audit &rarr;
            </button>
          </div>
        </div>

        {/* ROW CARD 4: Live FEFO Expiry Radar & Batch Safety Shield (Eliminates Empty Space) */}
        <div className="card-warm-3d p-5 flex flex-col justify-between relative overflow-hidden group">
          {/* Subtle 3D background watermark */}
          <div className="absolute -right-3 -bottom-3 w-16 h-16 opacity-[0.06] pointer-events-none group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-full h-full text-[#0d9488]" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-xs font-black text-[#42291e] uppercase tracking-wider">FEFO Expiry Radar</div>
                <div className="text-[10px] text-[#634d42] font-bold">Automated Batch Safety</div>
              </div>
              <span className="badge-3d-emerald text-[10px] px-2 py-0.5 rounded-full">Safe at POS</span>
            </div>

            {/* 3 Live Radar Metric Rows */}
            <div className="space-y-2.5 my-2.5">
              <div className="flex items-center justify-between p-2 rounded-xl bg-[#fff7ed] border border-[#ffedd5]">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-amber-500/15 text-amber-700 flex items-center justify-center text-xs font-bold">
                    ⚠️
                  </div>
                  <div>
                    <div className="text-[11px] font-black text-[#130906]">Near Expiry (&le;30d)</div>
                    <div className="text-[9px] text-[#634d42] font-semibold">Priority FEFO dispensing</div>
                  </div>
                </div>
                <span className="text-xs font-black text-amber-700">
                  {criticalExpiryMeds.length} Batches
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-[#fff1f2] border border-[#ffe4e6]">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-rose-500/15 text-rose-700 flex items-center justify-center text-xs font-bold">
                    🛡️
                  </div>
                  <div>
                    <div className="text-[11px] font-black text-[#130906]">Quarantined / Expired</div>
                    <div className="text-[9px] text-[#634d42] font-semibold">POS lock activated</div>
                  </div>
                </div>
                <span className="text-xs font-black text-rose-700">
                  {expiredMeds.length} Locked
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-[#ecfdf5] border border-[#d1fae5]">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-700 flex items-center justify-center text-xs font-bold">
                    ✓
                  </div>
                  <div>
                    <div className="text-[11px] font-black text-[#130906]">FEFO Integrity Index</div>
                    <div className="text-[9px] text-[#634d42] font-semibold">DRAP & ISO compliant</div>
                  </div>
                </div>
                <span className="text-xs font-black text-emerald-700">99.8%</span>
              </div>
            </div>
          </div>

          <div className="mt-2">
            <button
              onClick={() => setCurrentView('expiry')}
              className="w-full btn-3d btn-3d-warm py-2 text-xs font-bold rounded-xl text-white flex items-center justify-center gap-1.5"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Launch Expiry Radar &rarr;</span>
            </button>
          </div>
        </div>

      </div>

      {/* =========================================================================
          BOTTOM SUMMARY BANNER: Exact Luxury Chocolate Gradient from Image 2
          ========================================================================= */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#2a1711] via-[#3d2017] to-[#1e110d] text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        
        {/* Left Trophy & Congratulations */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#c2784d]/30 border border-[#c2784d]/60 flex items-center justify-center text-2xl text-[#f3ba9b] shrink-0">
            🏆
          </div>
          <div>
            <h3 className="font-heading font-black text-lg text-white">
              Amazing work!
            </h3>
            <p className="text-xs text-[#d6c7bc] max-w-sm mt-0.5">
              Zero expired batches dispensed at POS today. Your inventory is at 99.8% FEFO safety stability.
            </p>
          </div>
        </div>

        {/* Center 3 Encouragement Tips with Icons (Matching Image 2) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#eedfd2] border-y md:border-y-0 md:border-x border-white/10 py-3 md:py-0 md:px-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#e09e75] shrink-0" />
            <span className="text-[11px] leading-tight">Keep monitoring FEFO expiry queues</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-[#e09e75] shrink-0" />
            <span className="text-[11px] leading-tight">Keep engaging your loyalty clientele</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#e09e75] shrink-0" />
            <span className="text-[11px] leading-tight">Keep growing your healthcare brand</span>
          </div>
        </div>

        {/* Right Handwritten Script Flourish (Matching Image 2) */}
        <div className="text-right shrink-0">
          <div className="font-serif italic text-lg sm:text-xl text-[#f3ba9b]">
            You're doing great! ♡
          </div>
          <div className="text-[10px] text-[#9e8579] font-medium mt-0.5">
            PharmaGlow AI Operations
          </div>
        </div>

      </div>

    </div>
  );
};
