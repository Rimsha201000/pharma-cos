import React, { useState } from 'react';
import { 
  Settings, Key, Building2, DollarSign, Clock, ShieldCheck, 
  RotateCcw, Save, Eye, EyeOff, CheckCircle2, Sparkles 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, resetAllData } = useApp();
  const [formData, setFormData] = useState(settings);
  const [showApiKey, setShowApiKey] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to restore the pristine default demonstration database? All custom modifications will be re-seeded.')) {
      resetAllData();
      alert('Database successfully restored to standard demo state.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-slate-200/90 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              Enterprise Configuration & Parameters
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase">
              System Settings
            </span>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Manage pharmacy metadata, Gemini AI API credentials, currency, and tax parameters.
          </p>
        </div>

        {saveSuccess && (
          <div className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-1.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Preferences Saved!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Gemini AI Settings Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Sparkles className="w-5 h-5 text-rose-500" />
            <h3 className="font-heading font-bold text-base text-slate-900">
              Google Gemini AI Engine Configuration
            </h3>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            The Gemini API key powers the dual-language voice and text assistant for clinical inquiries, low stock detection, and sales analytics.
          </p>

          <div>
            <label className="font-semibold text-xs text-slate-700 block mb-1">
              Gemini API Key
            </label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={formData.geminiApiKey}
                onChange={(e) => setFormData({ ...formData, geminiApiKey: e.target.value })}
                placeholder="Enter your Gemini API key (e.g. AIzaSy...)"
                className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:border-teal-500"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="mt-1 text-[11px] text-slate-400">
              Key is stored locally in client session storage and sent securely only to Gemini endpoints.
            </div>
          </div>
        </div>

        {/* Business & Tax Identity Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-4 text-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building2 className="w-5 h-5 text-teal-700" />
            <h3 className="font-heading font-bold text-base text-slate-900">
              Pharmacy & Store Identity
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Store / Brand Name</label>
              <input
                type="text"
                value={formData.pharmacyName}
                onChange={(e) => setFormData({ ...formData, pharmacyName: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Physical Address (Receipt Header)</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Contact Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Official Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Drug License #</label>
              <input
                type="text"
                value={formData.licenseNumber}
                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Currency Symbol</label>
              <select
                value={formData.currencySymbol}
                onChange={(e) => setFormData({ ...formData, currencySymbol: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              >
                <option value="PKR">PKR (Rs)</option>
                <option value="$">USD ($)</option>
                <option value="AED">AED</option>
                <option value="£">GBP (£)</option>
                <option value="€">EUR (€)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Sales Tax Rate (%)</label>
              <input
                type="number"
                min="0"
                max="50"
                step="0.1"
                value={formData.taxRatePercent}
                onChange={(e) => setFormData({ ...formData, taxRatePercent: Number(e.target.value) })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Expiry Radar Warning (Days)</label>
              <input
                type="number"
                min="10"
                max="365"
                value={formData.expiryWarningDays}
                onChange={(e) => setFormData({ ...formData, expiryWarningDays: Number(e.target.value) })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between mt-2">
            <div>
              <div className="font-semibold text-slate-800">Automatic FEFO Dispensing Priority</div>
              <div className="text-[11px] text-slate-500">Automatically suggest nearest-expiry batches first at checkout.</div>
            </div>
            <input
              type="checkbox"
              checked={formData.autoFefoEnabled}
              onChange={(e) => setFormData({ ...formData, autoFefoEnabled: e.target.checked })}
              className="w-4 h-4 text-teal-600 rounded"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-xs flex items-center gap-2 transition-colors border border-red-200"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo Data</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save All Configuration</span>
          </button>
        </div>

      </form>

    </div>
  );
};
