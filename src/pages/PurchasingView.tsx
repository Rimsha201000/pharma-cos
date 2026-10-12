import React, { useState } from 'react';
import { 
  Truck, Plus, Search, CheckCircle2, Clock, DollarSign, 
  Package, Calendar, X, ArrowDownRight, RefreshCw 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PurchasingView: React.FC = () => {
  const { suppliers, medicines, cosmetics, receivePurchaseBatch, settings } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State for Receiving Goods
  const [itemType, setItemType] = useState<'MEDICINE' | 'COSMETIC'>('MEDICINE');
  const [selectedItemId, setSelectedItemId] = useState(medicines[0]?.id || '');
  const [selectedSupplierId, setSelectedSupplierId] = useState(suppliers[0]?.id || '');
  const [quantity, setQuantity] = useState(50);
  const [unitCost, setUnitCost] = useState(250);
  const [batchNumber, setBatchNumber] = useState(`PO-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
  const [expiryDate, setExpiryDate] = useState(new Date(Date.now() + 450 * 24 * 3600 * 1000).toISOString().split('T')[0]);

  const handleSubmitReceive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemId) {
      alert('Please select an item to receive.');
      return;
    }

    receivePurchaseBatch(
      itemType,
      selectedItemId,
      quantity,
      unitCost,
      batchNumber,
      expiryDate,
      selectedSupplierId
    );

    setIsModalOpen(false);
    alert(`Successfully received ${quantity} units into batch ${batchNumber}! Inventory updated.`);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/85 backdrop-blur-md p-6 rounded-3xl border border-white/80 shadow-lg shadow-black/5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
              Purchasing & Goods Receiving (GRN)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-900 text-xs font-extrabold uppercase">
              Batch Inflow
            </span>
          </div>
          <p className="text-slate-600 font-medium text-xs sm:text-sm mt-1">
            Receive pharmaceutical shipments & cosmetic restocks directly into FEFO inventory batches.
          </p>
        </div>

        <button
          onClick={() => {
            setBatchNumber(`PO-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
            setIsModalOpen(true);
          }}
          className="btn-3d btn-3d-teal px-5 py-3 text-white text-xs font-bold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Receive New Stock Shipment</span>
        </button>
      </div>

      {/* Procurement Inflow Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white/85 backdrop-blur-md border border-white/80 shadow-md flex items-center justify-between hover:shadow-lg transition-all">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Supply Partners</div>
            <div className="text-2xl font-black font-heading text-slate-900 mt-0.5">
              {suppliers.length} Registered Vendors
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-100/80 text-teal-800 flex items-center justify-center font-bold shadow-inner">
            <Truck className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/85 backdrop-blur-md border border-white/80 shadow-md flex items-center justify-between hover:shadow-lg transition-all">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Monitored Batches</div>
            <div className="text-2xl font-black font-heading text-slate-900 mt-0.5">
              {medicines.length + cosmetics.length} Live Batches
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-100/80 text-indigo-800 flex items-center justify-center font-bold shadow-inner">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/85 backdrop-blur-md border border-white/80 shadow-md flex items-center justify-between hover:shadow-lg transition-all">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Accounts Payable</div>
            <div className="text-2xl font-black font-heading text-rose-700 mt-0.5">
              {settings.currencySymbol} {suppliers.reduce((s, sup) => s + sup.balanceDue, 0).toLocaleString()}
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-100/80 text-rose-700 flex items-center justify-center font-bold shadow-inner">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Batch Procurement Table */}
      <div className="bg-white/85 backdrop-blur-md rounded-3xl border border-white/80 shadow-lg shadow-black/5 p-6 space-y-4">
        <h3 className="font-heading font-black text-xl text-slate-900">
          Verified Stock Inflow & Batch Records
        </h3>

        <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 backdrop-blur-sm border-b border-slate-200 text-slate-700 font-extrabold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-3">Item Name</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Batch Number</th>
                <th className="py-3 px-3">Supplier Source</th>
                <th className="py-3 px-3">Cost Price</th>
                <th className="py-3 px-3">Quantity</th>
                <th className="py-3 px-3">Expiry Date (FEFO)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {medicines.slice(0, 5).map(m => (
                <tr key={m.id} className="hover:bg-slate-50/60">
                  <td className="py-3 px-3 font-bold text-slate-900">{m.name}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-semibold text-[10px]">
                      Pharmacy
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono font-semibold text-slate-700">{m.batchNumber}</td>
                  <td className="py-3 px-3 text-slate-600">{m.supplierName}</td>
                  <td className="py-3 px-3 font-medium text-slate-800">{settings.currencySymbol} {m.purchasePrice}</td>
                  <td className="py-3 px-3 font-bold text-emerald-700">{m.quantity} units</td>
                  <td className="py-3 px-3 text-slate-600">{m.expiryDate}</td>
                </tr>
              ))}
              {cosmetics.slice(0, 3).map(c => (
                <tr key={c.id} className="hover:bg-slate-50/60">
                  <td className="py-3 px-3 font-bold text-slate-900">{c.name}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-semibold text-[10px]">
                      Cosmetics
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono font-semibold text-slate-700">{c.batchNumber}</td>
                  <td className="py-3 px-3 text-slate-600">{c.supplierName}</td>
                  <td className="py-3 px-3 font-medium text-slate-800">{settings.currencySymbol} {c.purchasePrice}</td>
                  <td className="py-3 px-3 font-bold text-emerald-700">{c.quantity} units</td>
                  <td className="py-3 px-3 text-slate-600">{c.expiryDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receive Goods Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-teal-700" />
                <h3 className="font-heading font-bold text-base text-slate-900">
                  Receive Supplier Shipment (GRN)
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReceive} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Product Category</label>
                  <select
                    value={itemType}
                    onChange={(e) => {
                      const t = e.target.value as any;
                      setItemType(t);
                      setSelectedItemId(t === 'MEDICINE' ? medicines[0]?.id : cosmetics[0]?.id);
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="MEDICINE">Pharmacy Medicine</option>
                    <option value="COSMETIC">Cosmetics & Beauty</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Select Item to Restock</label>
                  <select
                    value={selectedItemId}
                    onChange={(e) => setSelectedItemId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {itemType === 'MEDICINE' ? (
                      medicines.map(m => <option key={m.id} value={m.id}>{m.name}</option>)
                    ) : (
                      cosmetics.map(c => <option key={c.id} value={c.id}>{c.name}</option>)
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Supplier Source</label>
                <select
                  value={selectedSupplierId}
                  onChange={(e) => setSelectedSupplierId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  {suppliers.map(s => <option key={s.id} value={s.id}>{s.name} (Bal: {settings.currencySymbol}{s.balanceDue})</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Batch / Lot # *</label>
                  <input
                    type="text"
                    required
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Expiry Date *</label>
                  <input
                    type="date"
                    required
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Units Received</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Unit Cost ({settings.currencySymbol})</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={unitCost}
                    onChange={(e) => setUnitCost(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="p-3 bg-teal-50 rounded-xl text-teal-800 text-[11px] leading-relaxed">
                Total Purchase Value: <strong>{settings.currencySymbol} {(quantity * unitCost).toLocaleString()}</strong>.
                Receiving will increment available stock and register the new batch expiry date.
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-700 text-white font-semibold hover:bg-teal-800 shadow-sm"
                >
                  Confirm & Receive Shipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
