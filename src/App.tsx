import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Watermark } from './components/Watermark';
import { LandingPage } from './pages/LandingPage';
import { DashboardView } from './pages/DashboardView';
import { PharmacyView } from './pages/PharmacyView';
import { CosmeticsView } from './pages/CosmeticsView';
import { ExpiryRadarView } from './pages/ExpiryRadarView';
import { POSView } from './pages/POSView';
import { SalesHistoryView } from './pages/SalesHistoryView';
import { PurchasingView } from './pages/PurchasingView';
import { SuppliersView } from './pages/SuppliersView';
import { CustomersView } from './pages/CustomersView';
import { ReportsView } from './pages/ReportsView';
import { AIAssistantView } from './pages/AIAssistantView';
import { UsersManagementView } from './pages/UsersManagementView';
import { AuditLogsView } from './pages/AuditLogsView';
import { SettingsView } from './pages/SettingsView';
import { LoginView } from './pages/LoginView';
import { PharmaCosmeticsOrbitBackground } from './components/PharmaCosmeticsOrbitBackground';

const MainLayout: React.FC = () => {
  const { currentView } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If on login page, display luxury animated login card with 3D orbiting graphics
  if (currentView === 'login') {
    return (
      <main className="relative min-h-screen">
        <LoginView />
        <Watermark />
      </main>
    );
  }

  // If on landing page, display animated full landing experience
  if (currentView === 'landing') {
    return (
      <main className="relative min-h-screen">
        <LandingPage />
        <Watermark />
      </main>
    );
  }

  // Enterprise application layout with 3D moving medicines & cosmetics background
  return (
    <div className="relative min-h-screen flex flex-col text-slate-800 [overflow-x:clip]">
      {/* 3D Moving / Orbiting Medicines & Cosmetics in background */}
      <PharmaCosmeticsOrbitBackground variant="warm-luxury" />

      {/* Top Navbar: permanently sticky at top-0 across the entire screen */}
      <Navbar onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />

      {/* Main Workspace: Fixed Left Sidebar + Main Content Area */}
      <div className="relative z-10 flex-1 flex w-full">
        <Sidebar 
          isOpen={mobileMenuOpen} 
          onClose={() => setMobileMenuOpen(false)} 
        />

        <main className="flex-1 lg:pl-64 p-4 sm:p-6 lg:p-8 min-w-0 pb-16">
          <div className="max-w-[1440px] mx-auto">
            {currentView === 'dashboard' && <DashboardView />}
            {currentView === 'pharmacy' && <PharmacyView />}
            {currentView === 'cosmetics' && <CosmeticsView />}
            {currentView === 'expiry' && <ExpiryRadarView />}
            {currentView === 'pos' && <POSView />}
            {currentView === 'sales' && <SalesHistoryView />}
            {currentView === 'purchasing' && <PurchasingView />}
            {currentView === 'suppliers' && <SuppliersView />}
            {currentView === 'customers' && <CustomersView />}
            {currentView === 'reports' && <ReportsView />}
            {currentView === 'ai' && <AIAssistantView />}
            {currentView === 'users' && <UsersManagementView />}
            {currentView === 'audit' && <AuditLogsView />}
            {currentView === 'settings' && <SettingsView />}
          </div>
        </main>
      </div>

      {/* Permanent Developer Watermark in bottom corner */}
      <Watermark />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;
