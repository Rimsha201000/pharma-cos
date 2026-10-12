import React, { useState } from 'react';
import { 
  ShieldAlert, Clock, AlertTriangle, CheckCircle2, Shield, 
  Printer, Ban, RefreshCw, Filter, Sparkles, Pill, AlertOctagon
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ExpiryRadarView: React.FC = () => {
  const { medicines, cosmetics, quarantineMedicine, settings } = useApp();
  const [filterTier, setFilterTier] = useState<'ALL' | 'EXPIRED' | 'CRITICAL' | 'APPROACHING' | 'SAFE'>('ALL');

  const now = new Date();
  const getDaysUntilExpiry = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  // Compile unified items
  const allBatches = [
    ...medicines.map(m => ({
      id: m.id,
      name: m.name,
      type: 'MEDICINE' as const,
      batchNumber: m.batchNumber,
      expiryDate: m.expiryDate,
      daysLeft: getDaysUntilExpiry(m.expiryDate),
      quantity: m.quantity,
      sellingPrice: m.sellingPrice,
      isQuarantined: m.isQuarantined,
      supplierName: m.supplierName,
      prescriptionRequired: m.prescriptionRequired
    })),
    ...cosmetics.map(c => ({
      id: c.id,
      name: c.name,
      type: 'COSMETIC' as const,
      batchNumber: c.batchNumber,
      expiryDate: c.expiryDate,
      daysLeft: getDaysUntilExpiry(c.expiryDate),
      quantity: c.quantity,
      sellingPrice: c.sellingPrice,
      isQuarantined: c.isQuarantined,
      supplierName: c.supplierName,
      prescriptionRequired: false
    }))
  ];

  const expiredCount = allBatches.filter(b => b.daysLeft < 0 || b.isQuarantined).length;
  const criticalCount = allBatches.filter(b => b.daysLeft >= 0 && b.daysLeft <= 30 && !b.isQuarantined).length;
  const approachingCount = allBatches.filter(b => b.daysLeft > 30 && b.daysLeft <= 90 && !b.isQuarantined).length;
  const safeCount = allBatches.filter(b => b.daysLeft > 90 && !b.isQuarantined).length;

  const filteredBatches = allBatches.filter(b => {
    if (filterTier === 'EXPIRED') return b.daysLeft < 0 || b.isQuarantined;
    if (filterTier === 'CRITICAL') return b.daysLeft >= 0 && b.daysLeft <= 30 && !b.isQuarantined;
    if (filterTier === 'APPROACHING') return b.daysLeft > 30 && b.daysLeft <= 90 && !b.isQuarantined;
    if (filterTier === 'SAFE') return b.daysLeft > 90 && !b.isQuarantined;
    return true;
  }).sort((a, b) => a.daysLeft - b.daysLeft); // Ascending by nearest expiry

  const handlePrintAudit = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-slate-200/90 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              Expiry Radar & Quarantine Sentinel
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold uppercase">
              Clinical Drug Safety
            </span>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Real-time batch-wise calendar countdown. Quarantined batches are strictly blocked from POS checkout.
          </p>
        </div>

        <button
          onClick={handlePrintAudit}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-all"
        >
          <Printer className="w-4 h-4 text-teal-400" />
          <span>Print Expiry Audit Report</span>
        </button>
      </div>

      {/* 4 Tier Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Tier 1: Expired / Quarantined */}
        <button
          onClick={() => setFilterTier('EXPIRED')}
          className={`p-5 rounded-3xl border text-left transition-all ${
            filterTier === 'EXPIRED' 
              ? 'bg-red-500 text-white border-red-600 shadow-lg' 
              : 'bg-white border-red-200/80 hover:bg-red-50/50'
          }`}
        >
          <div className="flex justify-between items-center text-xs font-bold">
            <span>Tier 1: Expired / Quarantined</span>
            <AlertOctagon className="w-4 h-4" />
          </div>
          <div className="mt-2 text-3xl font-extrabold font-heading">
            {expiredCount} Batches
          </div>
          <div className={`mt-2 text-xs font-medium ${filterTier === 'EXPIRED' ? 'text-red-100' : 'text-red-600'}`}>
            Strictly Prohibited from Sales
          </div>
        </button>

        {/* Tier 2: Critical (<30 days) */}
        <button
          onClick={() => setFilterTier('CRITICAL')}
          className={`p-5 rounded-3xl border text-left transition-all ${
            filterTier === 'CRITICAL' 
              ? 'bg-amber-500 text-white border-amber-600 shadow-lg' 
              : 'bg-white border-amber-200/80 hover:bg-amber-50/50'
          }`}
        >
          <div className="flex justify-between items-center text-xs font-bold">
            <span>Tier 2: Critical (&le; 30 Days)</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="mt-2 text-3xl font-extrabold font-heading">
            {criticalCount} Batches
          </div>
          <div className={`mt-2 text-xs font-medium ${filterTier === 'CRITICAL' ? 'text-amber-100' : 'text-amber-600'}`}>
            Prioritize with FEFO Dispensing
          </div>
        </button>

        {/* Tier 3: Approaching (31-90 days) */}
        <button
          onClick={() => setFilterTier('APPROACHING')}
          className={`p-5 rounded-3xl border text-left transition-all ${
            filterTier === 'APPROACHING' 
              ? 'bg-teal-600 text-white border-teal-700 shadow-lg' 
              : 'bg-white border-teal-200/80 hover:bg-teal-50/50'
          }`}
        >
          <div className="flex justify-between items-center text-xs font-bold">
            <span>Tier 3: Approaching (31-90 Days)</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="mt-2 text-3xl font-extrabold font-heading">
            {approachingCount} Batches
          </div>
          <div className={`mt-2 text-xs font-medium ${filterTier === 'APPROACHING' ? 'text-teal-100' : 'text-teal-700'}`}>
            Under Active Surveillance
          </div>
        </button>

        {/* Tier 4: Healthy (>90 days) */}
        <button
          onClick={() => setFilterTier('SAFE')}
          className={`p-5 rounded-3xl border text-left transition-all ${
            filterTier === 'SAFE' 
              ? 'bg-emerald-600 text-white border-emerald-700 shadow-lg' 
              : 'bg-white border-emerald-200/80 hover:bg-emerald-50/50'
          }`}
        >
          <div className="flex justify-between items-center text-xs font-bold">
            <span>Tier 4: Optimal Shelf Life</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="mt-2 text-3xl font-extrabold font-heading">
            {safeCount} Batches
          </div>
          <div className={`mt-2 text-xs font-medium ${filterTier === 'SAFE' ? 'text-emerald-100' : 'text-emerald-700'}`}>
            Optimal Quality & Stability
          </div>
        </button>

      </div>

      {/* Filter Tabs Bar */}
      <div className="flex items-center justify-between p-3 bg-white rounded-2xl border border-slate-200 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {(['ALL', 'EXPIRED', 'CRITICAL', 'APPROACHING', 'SAFE'] as const).map(tier => (
            <button
              key={tier}
              onClick={() => setFilterTier(tier)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${
                filterTier === tier 
                  ? 'bg-slate-900 text-white shadow-xs' 
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
              }`}
            >
              {tier === 'ALL' ? 'All Batches' : tier}
            </button>
          ))}
        </div>

        <span className="text-slate-400 font-medium hidden sm:inline">
          Showing {filteredBatches.length} monitored batches
        </span>
      </div>

      {/* Batches Surveillance Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Item & Line</th>
                <th className="py-3.5 px-3">Batch Number</th>
                <th className="py-3.5 px-3">Expiry Date</th>
                <th className="py-3.5 px-3">Remaining Time</th>
                <th className="py-3.5 px-3">Units in Stock</th>
                <th className="py-3.5 px-3">Safety Status</th>
                <th className="py-3.5 px-4 text-right">Quarantine Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBatches.map(b => {
                const isExpired = b.daysLeft < 0 || b.isQuarantined;
                const isCritical = b.daysLeft >= 0 && b.daysLeft <= 30;

                return (
                  <tr key={`${b.type}-${b.id}`} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        {b.type === 'MEDICINE' ? (
                          <Pill className="w-3.5 h-3.5 text-teal-600" />
                        ) : (
                          <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                        )}
                        <span>{b.name}</span>
                        {b.prescriptionRequired && (
                          <span className="px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 font-bold text-[10px]">Rx</span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500">Supplier: {b.supplierName}</div>
                    </td>

                    <td className="py-3.5 px-3 font-mono font-semibold text-slate-800">
                      {b.batchNumber}
                    </td>

                    <td className="py-3.5 px-3 font-medium text-slate-700">
                      {b.expiryDate}
                    </td>

                    <td className="py-3.5 px-3">
                      {b.daysLeft < 0 ? (
                        <span className="font-bold text-red-600">Expired {Math.abs(b.daysLeft)} days ago</span>
                      ) : b.daysLeft === 0 ? (
                        <span className="font-bold text-red-600">Expires TODAY!</span>
                      ) : (
                        <span className={`font-semibold ${b.daysLeft <= 30 ? 'text-amber-600' : 'text-slate-700'}`}>
                          {b.daysLeft} days remaining
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 font-bold text-slate-900">
                      {b.quantity} units
                    </td>

                    <td className="py-3.5 px-3">
                      {b.isQuarantined ? (
                        <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-800 font-bold text-[10px] uppercase">
                          Quarantined (Blocked)
                        </span>
                      ) : isCritical ? (
                        <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-semibold text-[10px]">
                          Near Expiry Alert
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-medium text-[10px]">
                          Healthy
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {b.type === 'MEDICINE' ? (
                        <button
                          onClick={() => quarantineMedicine(b.id, !b.isQuarantined)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                            b.isQuarantined 
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200' 
                              : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                          }`}
                        >
                          {b.isQuarantined ? 'Release Quarantine' : 'Quarantine Batch'}
                        </button>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Cosmetic Shelf</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
