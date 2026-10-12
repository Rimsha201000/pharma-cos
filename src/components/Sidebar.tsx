import React from 'react';
import { 
  LayoutDashboard, Pill, Sparkles, ShieldAlert, ShoppingBag, 
  Receipt, Truck, Users2, HeartHandshake, BarChart3, Bot, 
  ShieldCheck, History, Settings, X, ChevronRight, Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { currentView, setCurrentView, hasPermission, medicines, cosmetics, sales } = useApp();

  // Expiry alert badge count
  const now = new Date();
  const getDaysUntilExpiry = (dateStr: string) => {
    const diffTime = new Date(dateStr).getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const criticalExpiryCount = medicines.filter(m => {
    const days = getDaysUntilExpiry(m.expiryDate);
    return days <= 30;
  }).length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'pharmacy', label: 'Pharmacy & FEFO', icon: Pill, badge: `${medicines.length}` },
    { id: 'cosmetics', label: 'Cosmetics & Beauty', icon: Sparkles, badge: `${cosmetics.length}` },
    { 
      id: 'expiry', 
      label: 'Expiry Radar', 
      icon: ShieldAlert, 
      badge: criticalExpiryCount > 0 ? `${criticalExpiryCount} Alert` : null, 
      badgeColor: 'bg-rose-500 text-white' 
    },
    { id: 'pos', label: 'Point of Sale (POS)', icon: ShoppingBag, badge: 'Rapid' },
    { id: 'sales', label: 'Sales & Receipts', icon: Receipt, badge: `${sales.length}` },
    { id: 'purchasing', label: 'Purchasing & POs', icon: Truck, badge: null },
    { id: 'suppliers', label: 'Suppliers Directory', icon: HeartHandshake, badge: null },
    { id: 'customers', label: 'Customers & Loyalty', icon: Users2, badge: null },
    { id: 'reports', label: 'Analytics & Reports', icon: BarChart3, badge: null },
    { id: 'ai', label: 'AI Gemini Assistant', icon: Bot, badge: 'Smart', badgeColor: 'bg-gradient-to-r from-teal-500 to-rose-500 text-white' },
    { id: 'users', label: 'User Management', icon: ShieldCheck, badge: null },
    { id: 'audit', label: 'Audit Trail Logs', icon: History, badge: null },
    { id: 'settings', label: 'System Settings', icon: Settings, badge: null },
  ];

  // Filter items by active user role permissions
  const visibleItems = navItems.filter(item => hasPermission(item.id));

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden animate-fadeIn"
        />
      )}

      {/* Sidebar Container - Exact Luxury Espresso Aesthetic from Image 2 */}
      <aside className={`
        fixed top-0 lg:top-16 bottom-0 left-0
        w-64 bg-[#1f120e] text-[#e8ded6] border-r border-[#38231c] z-30
        flex flex-col transition-transform duration-300 ease-in-out shrink-0
        ${isOpen ? 'translate-x-0 shadow-2xl z-50 h-screen' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Mobile Header with Close button */}
        <div className="lg:hidden p-4 border-b border-[#38231c] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/pharmaglow-logo.png" alt="PharmaGlow" className="w-8 h-8 object-contain" />
            <span className="font-heading font-bold text-white">PharmaGlow</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/70"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Brand header snippet for sidebar */}
        <div className="hidden lg:flex items-center justify-between px-5 pt-4 pb-2 border-b border-[#301c15]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#c2784d]/20 border border-[#c2784d]/40 flex items-center justify-center text-[#e89a6c] font-black text-xs">
              PG
            </div>
            <span className="font-heading font-extrabold text-sm tracking-wide text-white">
              PharmaGlow <span className="text-[#c2784d] font-serif italic text-xs">Care</span>
            </span>
          </div>
          <span className="text-[10px] text-[#c2784d] border border-[#c2784d]/40 px-1.5 py-0.2 rounded-full font-bold">
            PRO
          </span>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          <div className="px-3 pb-2 pt-1 text-[10px] font-bold text-[#9e8579] uppercase tracking-wider">
            Management Modules
          </div>

          {visibleItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  onClose();
                }}
                className={`
                  w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold
                  transition-all duration-200 group
                  ${isActive 
                    ? 'bg-[#c2784d] text-white shadow-md shadow-[#c2784d]/30 font-bold' 
                    : 'text-[#d6c7bc] hover:bg-white/8 hover:text-white'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-white' : 'text-[#a89387] group-hover:text-[#e09e75]'
                  }`} />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                      item.badgeColor || (isActive ? 'bg-black/25 text-white' : 'bg-white/10 text-[#e8ded6]')
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer Widget: Premium Insights Card (Matching Image 2) */}
        <div className="p-3 border-t border-[#301c15] bg-[#170c09]">
          <div className="p-3 rounded-2xl bg-[#281711] border border-[#4a2a1f] text-xs relative overflow-hidden group">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-lg bg-[#c2784d]/25 text-[#e09e75] flex items-center justify-center">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-white text-xs">FEFO Radar Active</span>
            </div>
            <p className="text-[10px] text-[#bdaaa0] leading-snug mb-2">
              Automated near-expiry batch quarantine & POS safety shield.
            </p>
            <button
              onClick={() => setCurrentView('expiry')}
              className="w-full btn-3d btn-3d-warm py-1.5 text-[11px] font-bold rounded-lg text-white"
            >
              Check Expiry Radar
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
