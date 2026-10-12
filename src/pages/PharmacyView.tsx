import React, { useState } from 'react';
import { 
  Pill, Plus, Search, Filter, Download, Upload, Shield, 
  AlertTriangle, Clock, Edit2, Trash2, CheckCircle2, X, 
  FileText, ArrowUpDown, ShieldAlert, ShoppingCart, RefreshCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Medicine, StorageCondition } from '../types';

export const PharmacyView: React.FC = () => {
  const { 
    medicines, addMedicine, updateMedicine, deleteMedicine, 
    quarantineMedicine, suppliers, settings, addToCart, setCurrentView 
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [filterRxOnly, setFilterRxOnly] = useState(false);
  const [sortByFefo, setSortByFefo] = useState(true);

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);

  // Stock Adjustment Modal
  const [adjustingMed, setAdjustingMed] = useState<Medicine | null>(null);
  const [adjustQuantity, setAdjustQuantity] = useState<number>(0);
  const [adjustReason, setAdjustReason] = useState('New Shipment Received');

  // Form State
  const initialForm = {
    name: '',
    genericName: '',
    brand: '',
    category: 'Antibiotics',
    strength: '500mg',
    dosageForm: 'Tablet' as Medicine['dosageForm'],
    barcode: '',
    sku: '',
    batchNumber: '',
    supplierId: suppliers[0]?.id || '',
    supplierName: suppliers[0]?.name || '',
    purchasePrice: 100,
    sellingPrice: 150,
    quantity: 50,
    reorderLevel: 15,
    mfgDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split('T')[0],
    storageCondition: 'Room Temperature (15-25°C)' as StorageCondition,
    prescriptionRequired: false,
    isQuarantined: false,
    notes: ''
  };

  const [formData, setFormData] = useState(initialForm);

  const categories = ['ALL', 'Antibiotics', 'Analgesics', 'Respiratory', 'Cardiovascular', 'Gastrointestinal', 'Endocrinology'];

  const now = new Date();
  const getDaysUntilExpiry = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  // Filter & Sort
  const filteredMedicines = medicines
    .filter(m => {
      const matchesSearch = 
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.genericName.toLowerCase().includes(search.toLowerCase()) ||
        m.batchNumber.toLowerCase().includes(search.toLowerCase()) ||
        m.barcode.includes(search);
      const matchesCat = selectedCategory === 'ALL' || m.category === selectedCategory;
      const matchesRx = !filterRxOnly || m.prescriptionRequired;
      return matchesSearch && matchesCat && matchesRx;
    })
    .sort((a, b) => {
      if (sortByFefo) {
        // FEFO: earliest expiry first
        return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
      }
      return a.name.localeCompare(b.name);
    });

  const handleOpenAdd = () => {
    setEditingMedicine(null);
    setFormData({
      ...initialForm,
      barcode: `8964000${Math.floor(10000 + Math.random() * 90000)}`,
      sku: `MED-${Math.floor(100 + Math.random() * 900)}`,
      batchNumber: `BAT-${new Date().getFullYear()}-${Math.floor(10 + Math.random() * 90)}`
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (m: Medicine) => {
    setEditingMedicine(m);
    setFormData({
      name: m.name,
      genericName: m.genericName,
      brand: m.brand,
      category: m.category,
      strength: m.strength,
      dosageForm: m.dosageForm,
      barcode: m.barcode,
      sku: m.sku,
      batchNumber: m.batchNumber,
      supplierId: m.supplierId,
      supplierName: m.supplierName,
      purchasePrice: m.purchasePrice,
      sellingPrice: m.sellingPrice,
      quantity: m.quantity,
      reorderLevel: m.reorderLevel,
      mfgDate: m.mfgDate,
      expiryDate: m.expiryDate,
      storageCondition: m.storageCondition,
      prescriptionRequired: m.prescriptionRequired,
      isQuarantined: m.isQuarantined,
      notes: m.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sup = suppliers.find(s => s.id === formData.supplierId);
    const resolvedSupplierName = sup ? sup.name : formData.supplierName || 'Standard Supplier';

    if (editingMedicine) {
      updateMedicine(editingMedicine.id, {
        ...formData,
        supplierName: resolvedSupplierName
      });
    } else {
      addMedicine({
        ...formData,
        supplierName: resolvedSupplierName
      });
    }
    setIsModalOpen(false);
  };

  const handleStockAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingMed) return;
    const newQty = Math.max(0, adjustingMed.quantity + adjustQuantity);
    updateMedicine(adjustingMed.id, { quantity: newQty });
    setAdjustingMed(null);
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['ID,Name,GenericName,Brand,Category,Strength,Dosage,Batch,ExpiryDate,DaysToExpiry,Stock,Price,RxRequired,Quarantined'];
    const rows = filteredMedicines.map(m => 
      `"${m.id}","${m.name}","${m.genericName}","${m.brand}","${m.category}","${m.strength}","${m.dosageForm}","${m.batchNumber}","${m.expiryDate}",${getDaysUntilExpiry(m.expiryDate)},${m.quantity},${m.sellingPrice},${m.prescriptionRequired},${m.isQuarantined}`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PharmaGlow_Medicines_FEFO_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-slate-200/90 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              Pharmacy & FEFO Catalog
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase">
              First-Expired First-Out
            </span>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Clinical pharmaceutical management, batch-level tracking, and prescription compliance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Medicine</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, generic, batch or barcode..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Categories, Rx toggle, Sort by FEFO */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none font-medium"
          >
            {categories.map(c => <option key={c} value={c}>{c === 'ALL' ? 'All Categories' : c}</option>)}
          </select>

          <button
            onClick={() => setFilterRxOnly(!filterRxOnly)}
            className={`px-3 py-2 rounded-xl font-semibold transition-colors flex items-center gap-1.5 ${
              filterRxOnly 
                ? 'bg-rose-100 text-rose-800 border border-rose-200' 
                : 'bg-slate-50 text-slate-600 border border-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Rx Only</span>
          </button>

          <button
            onClick={() => setSortByFefo(!sortByFefo)}
            className={`px-3 py-2 rounded-xl font-semibold transition-colors flex items-center gap-1.5 ${
              sortByFefo 
                ? 'bg-teal-100 text-teal-800 border border-teal-200' 
                : 'bg-slate-50 text-slate-600 border border-slate-200'
            }`}
            title="Sort by nearest expiry first (FEFO)"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>FEFO Sorting {sortByFefo ? 'Active' : 'Off'}</span>
          </button>
        </div>

      </div>

      {/* Medicines Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Medicine Details</th>
                <th className="py-3.5 px-3">Batch & Expiry (FEFO)</th>
                <th className="py-3.5 px-3">Storage</th>
                <th className="py-3.5 px-3">Stock Level</th>
                <th className="py-3.5 px-3">Price</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMedicines.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No medicines match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredMedicines.map((med, index) => {
                  const daysLeft = getDaysUntilExpiry(med.expiryDate);
                  const isExpired = daysLeft < 0 || med.isQuarantined;
                  const isCritical = daysLeft >= 0 && daysLeft <= 30;

                  return (
                    <tr key={med.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Name & Generic */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-start gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
                            <Pill className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                              {med.name}
                              {med.prescriptionRequired && (
                                <span className="px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 font-bold text-[10px]" title="Prescription Required">
                                  Rx
                                </span>
                              )}
                            </div>
                            <div className="text-slate-500 text-[11px]">
                              {med.genericName} • <span className="text-slate-700 font-medium">{med.strength}</span> ({med.dosageForm})
                            </div>
                            <div className="text-[10px] text-slate-400">
                              Barcode: {med.barcode} • SKU: {med.sku}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Batch & Expiry */}
                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-slate-800">
                          Batch: <code className="bg-slate-100 px-1 py-0.2 rounded">{med.batchNumber}</code>
                        </div>
                        <div className="text-[11px] mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span className={isExpired ? 'text-rose-600 font-bold' : isCritical ? 'text-amber-600 font-bold' : 'text-slate-600'}>
                            {med.expiryDate} ({daysLeft < 0 ? 'Expired' : `${daysLeft}d left`})
                          </span>
                        </div>
                        {index === 0 && sortByFefo && !isExpired && (
                          <span className="inline-block mt-1 px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                            FEFO #1 Priority
                          </span>
                        )}
                      </td>

                      {/* Storage */}
                      <td className="py-3.5 px-3 text-slate-600">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-medium">
                          {med.storageCondition}
                        </span>
                      </td>

                      {/* Stock Level */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className={`font-bold text-sm ${
                            med.quantity <= 0 ? 'text-red-600' : med.quantity <= med.reorderLevel ? 'text-amber-600' : 'text-slate-900'
                          }`}>
                            {med.quantity}
                          </span>
                          <span className="text-slate-400 text-[11px]">units</span>
                        </div>
                        {med.quantity <= med.reorderLevel && (
                          <span className="text-[10px] text-amber-600 font-medium">
                            Low stock (Min: {med.reorderLevel})
                          </span>
                        )}
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-900">
                          {settings.currencySymbol} {med.sellingPrice}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Cost: {settings.currencySymbol} {med.purchasePrice}
                        </div>
                      </td>

                      {/* Quarantine / Safety Status */}
                      <td className="py-3.5 px-3">
                        {med.isQuarantined ? (
                          <span className="px-2 py-1 rounded-md bg-red-100 text-red-800 font-bold text-[10px] uppercase">
                            Quarantined
                          </span>
                        ) : isCritical ? (
                          <span className="px-2 py-1 rounded-md bg-amber-100 text-amber-800 font-semibold text-[10px]">
                            Critical Expiry
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-md bg-emerald-100 text-emerald-800 font-medium text-[10px]">
                            Sale Permitted
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* POS Add Button */}
                          <button
                            onClick={() => {
                              const res = addToCart(med, 'MEDICINE');
                              if (res.success) {
                                setCurrentView('pos');
                              } else {
                                alert(res.message);
                              }
                            }}
                            disabled={med.isQuarantined || med.quantity <= 0}
                            className="p-1.5 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-700 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Add to POS Cart"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                          </button>

                          {/* Quick Stock Adjustment */}
                          <button
                            onClick={() => {
                              setAdjustingMed(med);
                              setAdjustQuantity(10);
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
                            title="Adjust Stock Quantity"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>

                          {/* Quarantine Toggle */}
                          <button
                            onClick={() => quarantineMedicine(med.id, !med.isQuarantined)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              med.isQuarantined 
                                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' 
                                : 'text-slate-400 hover:text-red-600 hover:bg-red-50'
                            }`}
                            title={med.isQuarantined ? 'Release from Quarantine' : 'Quarantine Batch'}
                          >
                            <ShieldAlert className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => handleOpenEdit(med)}
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
                            title="Edit Medicine Details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete ${med.name}?`)) {
                                deleteMedicine(med.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Medicine Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-teal-400" />
                <h3 className="font-heading font-semibold text-base">
                  {editingMedicine ? 'Edit Pharmaceutical Record' : 'Register New Medicine (FEFO Ready)'}
                </h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Augmentin 625mg"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Generic Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.genericName}
                    onChange={(e) => setFormData({ ...formData, genericName: e.target.value })}
                    placeholder="e.g. Amoxicillin + Clavulanate"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {categories.filter(c => c !== 'ALL').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Strength</label>
                  <input
                    type="text"
                    value={formData.strength}
                    onChange={(e) => setFormData({ ...formData, strength: e.target.value })}
                    placeholder="500mg, 10ml"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Dosage Form</label>
                  <select
                    value={formData.dosageForm}
                    onChange={(e) => setFormData({ ...formData, dosageForm: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {['Tablet', 'Capsule', 'Syrup', 'Injection', 'Suspension', 'Ointment', 'Eye Drops', 'Inhaler'].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Batch Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.batchNumber}
                    onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Barcode</label>
                  <input
                    type="text"
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">SKU</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Manufacturing Date</label>
                  <input
                    type="date"
                    value={formData.mfgDate}
                    onChange={(e) => setFormData({ ...formData, mfgDate: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Expiry Date (FEFO Key) *</label>
                  <input
                    type="date"
                    required
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Purchase Price</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.purchasePrice}
                    onChange={(e) => setFormData({ ...formData, purchasePrice: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Selling Price *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    required
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Quantity (Stock)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Reorder Level</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.reorderLevel}
                    onChange={(e) => setFormData({ ...formData, reorderLevel: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Supplier</label>
                  <select
                    value={formData.supplierId}
                    onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Storage Condition</label>
                  <select
                    value={formData.storageCondition}
                    onChange={(e) => setFormData({ ...formData, storageCondition: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Room Temperature (15-25°C)">Room Temperature (15-25°C)</option>
                    <option value="Cold Storage (2-8°C)">Cold Storage (2-8°C)</option>
                    <option value="Cool & Dry Place">Cool & Dry Place</option>
                    <option value="Protect from Light">Protect from Light</option>
                  </select>
                </div>
              </div>

              {/* Rx prescription toggle */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800">Prescription Required (Rx Flag)</div>
                  <div className="text-[11px] text-slate-500">Requires verified doctor name & prescription number before checkout.</div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.prescriptionRequired}
                  onChange={(e) => setFormData({ ...formData, prescriptionRequired: e.target.checked })}
                  className="w-4 h-4 text-teal-600 rounded"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
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
                  {editingMedicine ? 'Update Medicine' : 'Save & Register Batch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {adjustingMed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-xs">
            <h3 className="font-heading font-bold text-base text-slate-900 mb-1">
              Adjust Stock Quantity
            </h3>
            <p className="text-slate-500 mb-4">
              Item: <span className="font-bold text-slate-800">{adjustingMed.name}</span> (Current: {adjustingMed.quantity} units)
            </p>

            <form onSubmit={handleStockAdjustSubmit} className="space-y-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Units to Add or Subtract (+/-)</label>
                <input
                  type="number"
                  value={adjustQuantity}
                  onChange={(e) => setAdjustQuantity(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold"
                  placeholder="e.g. +20 or -5"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Reason for Adjustment</label>
                <select
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="New Shipment Received">New Shipment Received</option>
                  <option value="Physical Inventory Recount">Physical Inventory Recount</option>
                  <option value="Damaged / Broken Blister Write-off">Damaged / Broken Blister Write-off</option>
                  <option value="Supplier Return">Supplier Return</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustingMed(null)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-teal-700 text-white font-semibold hover:bg-teal-800"
                >
                  Apply Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
