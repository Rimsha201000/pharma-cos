import React, { useState } from 'react';
import { 
  HeartHandshake, Plus, Search, Phone, Mail, MapPin, 
  DollarSign, Star, Edit2, X, CheckCircle2 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Supplier } from '../types';

export const SuppliersView: React.FC = () => {
  const { suppliers, addSupplier, updateSupplier, settings } = useApp();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  const initialForm = {
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    balanceDue: 0,
    rating: 5
  };

  const [formData, setFormData] = useState(initialForm);

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
    s.phone.includes(search)
  );

  const handleOpenAdd = () => {
    setEditingSupplier(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s: Supplier) => {
    setEditingSupplier(s);
    setFormData({
      name: s.name,
      contactPerson: s.contactPerson,
      email: s.email,
      phone: s.phone,
      address: s.address,
      balanceDue: s.balanceDue,
      rating: s.rating
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSupplier) {
      updateSupplier(editingSupplier.id, formData);
    } else {
      addSupplier(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-slate-200/90 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              Suppliers & Vendor Network
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase">
              Partners
            </span>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Maintain authorized pharmaceutical distributors and cosmetic brand supply accounts.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Supplier</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search supplier name, contact person or phone..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500"
          />
        </div>
        <div className="text-slate-500 font-medium">
          Total: <span className="font-bold text-slate-800">{filteredSuppliers.length}</span> Vendors
        </div>
      </div>

      {/* Suppliers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSuppliers.map(s => (
          <div key={s.id} className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-5 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-heading font-bold text-base text-slate-900">{s.name}</h3>
                  <div className="text-xs text-slate-500">Contact: {s.contactPerson}</div>
                </div>
                <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md text-xs font-bold">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span>{s.rating}</span>
                </div>
              </div>

              <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{s.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{s.email}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span className="truncate">{s.address}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Payable Balance</div>
                <div className={`font-heading font-bold text-sm ${s.balanceDue > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {settings.currencySymbol} {s.balanceDue.toLocaleString()}
                </div>
              </div>

              <button
                onClick={() => handleOpenEdit(s)}
                className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
                title="Edit Supplier"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-heading font-bold text-base text-slate-900">
                {editingSupplier ? 'Edit Supplier Information' : 'Add New Supplier Partner'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Company / Vendor Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="e.g. Pfizer Pakistan Ltd"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Phone *</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Office Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Balance Due ({settings.currencySymbol})</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.balanceDue}
                    onChange={(e) => setFormData({ ...formData, balanceDue: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Rating (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
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
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
