import React, { useState } from 'react';
import { 
  Sparkles, Plus, Search, Filter, Tag, ShoppingCart, 
  Trash2, Edit2, Clock, CheckCircle2, X, Download, Heart
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Cosmetic } from '../types';

export const CosmeticsView: React.FC = () => {
  const { 
    cosmetics, addCosmetic, updateCosmetic, deleteCosmetic, 
    quarantineCosmetic, suppliers, settings, addToCart, setCurrentView 
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCosmetic, setEditingCosmetic] = useState<Cosmetic | null>(null);

  const categories = ['ALL', 'Skincare', 'Makeup', 'Haircare', 'Fragrances', 'Beauty Accessories', 'Body Care'];

  const initialForm = {
    name: '',
    brand: '',
    category: 'Skincare' as const,
    shade: '',
    size: '50ml',
    barcode: '',
    batchNumber: '',
    supplierId: suppliers[2]?.id || suppliers[0]?.id || '',
    supplierName: suppliers[2]?.name || suppliers[0]?.name || '',
    purchasePrice: 1500,
    sellingPrice: 2200,
    quantity: 20,
    reorderLevel: 5,
    pao: '12M',
    expiryDate: new Date(Date.now() + 500 * 24 * 3600 * 1000).toISOString().split('T')[0],
    discountPercent: 0,
    isQuarantined: false,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&auto=format&fit=crop&q=80'
  };

  const [formData, setFormData] = useState(initialForm);

  const filteredCosmetics = cosmetics.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.brand.toLowerCase().includes(search.toLowerCase()) ||
      (c.shade && c.shade.toLowerCase().includes(search.toLowerCase())) ||
      c.barcode.includes(search);
    const matchesCat = selectedCategory === 'ALL' || c.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleOpenAdd = () => {
    setEditingCosmetic(null);
    setFormData({
      ...initialForm,
      barcode: `334800${Math.floor(100000 + Math.random() * 900000)}`,
      batchNumber: `LOT-${new Date().getFullYear()}-${Math.floor(10 + Math.random() * 90)}`
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Cosmetic) => {
    setEditingCosmetic(c);
    setFormData({
      name: c.name,
      brand: c.brand,
      category: c.category as any,
      shade: c.shade || '',
      size: c.size,
      barcode: c.barcode,
      batchNumber: c.batchNumber,
      supplierId: c.supplierId,
      supplierName: c.supplierName,
      purchasePrice: c.purchasePrice,
      sellingPrice: c.sellingPrice,
      quantity: c.quantity,
      reorderLevel: c.reorderLevel,
      pao: c.pao || '12M',
      expiryDate: c.expiryDate,
      discountPercent: c.discountPercent || 0,
      isQuarantined: c.isQuarantined,
      image: c.image || initialForm.image
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sup = suppliers.find(s => s.id === formData.supplierId);
    const resolvedSupplierName = sup ? sup.name : formData.supplierName || 'Luxury Beauty Direct';

    if (editingCosmetic) {
      updateCosmetic(editingCosmetic.id, {
        ...formData,
        supplierName: resolvedSupplierName
      });
    } else {
      addCosmetic({
        ...formData,
        supplierName: resolvedSupplierName
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-slate-200/90 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              Cosmetics, Skincare & Fragrances
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold uppercase">
              Beauty Luxury Line
            </span>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Track premium cosmetic shades, PAO markers, lot batches, and promotional offers.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Beauty Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cosmetics, brand, shade or barcode..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${
                selectedCategory === c 
                  ? 'bg-rose-500 text-white shadow-xs' 
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
              }`}
            >
              {c === 'ALL' ? 'All Products' : c}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCosmetics.map(c => {
          const hasDiscount = (c.discountPercent || 0) > 0;
          const discountedPrice = hasDiscount 
            ? c.sellingPrice - (c.sellingPrice * (c.discountPercent! / 100))
            : c.sellingPrice;

          return (
            <div 
              key={c.id} 
              className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group"
            >
              {/* Product Image Header */}
              <div className="relative h-44 bg-gradient-to-tr from-slate-100 to-rose-50 overflow-hidden flex items-center justify-center p-3">
                <img
                  src={c.image || 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400&auto=format&fit=crop&q=80'}
                  alt={c.name}
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.onerror = null;
                    target.src = 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400&auto=format&fit=crop&q=80';
                  }}
                  className="h-full w-full max-h-36 object-contain rounded-2xl group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
                  loading="lazy"
                />

                {/* Category Pill */}
                <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold text-slate-800 shadow-xs">
                  {c.category}
                </div>

                {/* Discount Badge if any */}
                {hasDiscount && (
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-extrabold shadow-sm flex items-center gap-1">
                    <Tag className="w-2.5 h-2.5" />
                    <span>-{c.discountPercent}% OFF</span>
                  </div>
                )}

                {/* PAO Badge */}
                {c.pao && (
                  <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-mono">
                    PAO: {c.pao}
                  </div>
                )}
              </div>

              {/* Details Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-rose-600">
                    {c.brand}
                  </div>
                  <h3 className="font-heading font-bold text-base text-slate-900 group-hover:text-rose-700 transition-colors">
                    {c.name}
                  </h3>
                  
                  {/* Shade & Size */}
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    {c.shade && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 font-medium text-slate-700 border border-slate-200">
                        Shade: {c.shade}
                      </span>
                    )}
                    <span className="font-medium">{c.size}</span>
                  </div>
                </div>

                {/* Lot & Expiry */}
                <div className="text-[11px] text-slate-500 space-y-0.5 border-t border-slate-100 pt-2">
                  <div className="flex justify-between">
                    <span>Batch Lot:</span>
                    <span className="font-mono text-slate-700">{c.batchNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Expiry Date:</span>
                    <span className="text-slate-700 font-medium">{c.expiryDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Available Stock:</span>
                    <span className={`font-bold ${c.quantity <= c.reorderLevel ? 'text-amber-600' : 'text-emerald-700'}`}>
                      {c.quantity} in stock
                    </span>
                  </div>
                </div>

                {/* Price & Action Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    {hasDiscount ? (
                      <div>
                        <span className="text-xs text-slate-400 line-through mr-1">
                          {settings.currencySymbol} {c.sellingPrice}
                        </span>
                        <span className="font-heading font-extrabold text-base text-rose-600">
                          {settings.currencySymbol} {discountedPrice}
                        </span>
                      </div>
                    ) : (
                      <div className="font-heading font-extrabold text-base text-slate-900">
                        {settings.currencySymbol} {c.sellingPrice}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(c)}
                      className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        const res = addToCart(c, 'COSMETIC');
                        if (res.success) {
                          setCurrentView('pos');
                        } else {
                          alert(res.message);
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Sell</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Cosmetic Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-rose-400" />
                <h3 className="font-heading font-semibold text-base">
                  {editingCosmetic ? 'Edit Beauty Product' : 'Register Luxury Cosmetic Item'}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. CeraVe Facial Cleanser"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Brand *</label>
                  <input
                    type="text"
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="e.g. CeraVe / Maybelline"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {categories.filter(c => c !== 'ALL').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Shade / Color</label>
                  <input
                    type="text"
                    value={formData.shade}
                    onChange={(e) => setFormData({ ...formData, shade: e.target.value })}
                    placeholder="Ruby Red, Warm Beige"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Size / Volume</label>
                  <input
                    type="text"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    placeholder="50ml, 30g"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Batch / Lot # *</label>
                  <input
                    type="text"
                    required
                    value={formData.batchNumber}
                    onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">PAO Period</label>
                  <select
                    value={formData.pao}
                    onChange={(e) => setFormData({ ...formData, pao: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="6M">6 Months (6M)</option>
                    <option value="12M">12 Months (12M)</option>
                    <option value="24M">24 Months (24M)</option>
                    <option value="36M">36 Months (36M)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Purchase Cost</label>
                  <input
                    type="number"
                    min="0"
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
                    required
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Discount (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="90"
                    value={formData.discountPercent}
                    onChange={(e) => setFormData({ ...formData, discountPercent: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Stock Qty</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
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
                  className="px-5 py-2 rounded-xl bg-rose-600 text-white font-semibold hover:bg-rose-700 shadow-sm"
                >
                  Save Cosmetic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
