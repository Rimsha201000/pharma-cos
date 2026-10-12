import React, { useState } from 'react';
import { 
  Users2, Plus, Search, Phone, Mail, Award, 
  Calendar, DollarSign, X, CheckCircle2 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CustomersView: React.FC = () => {
  const { customers, addCustomer, settings } = useApp();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    addCustomer(formData);
    setFormData({ name: '', phone: '', email: '' });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-slate-200/90 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              Customers & Loyalty Club
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold uppercase">
              Loyalty Engine
            </span>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Reward frequent patients and beauty clients with points redeemable at checkout.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Customer</span>
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
            placeholder="Search customer name or phone number..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500"
          />
        </div>
        <div className="text-slate-500 font-medium">
          Total: <span className="font-bold text-slate-800">{filteredCustomers.length}</span> Clients
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Customer Profile</th>
                <th className="py-3.5 px-3">Phone</th>
                <th className="py-3.5 px-3">Email</th>
                <th className="py-3.5 px-3">Visits</th>
                <th className="py-3.5 px-3">Loyalty Points</th>
                <th className="py-3.5 px-3">Total Spend</th>
                <th className="py-3.5 px-4 text-right">Last Purchase</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map(cust => (
                <tr key={cust.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 text-sm">
                    {cust.name}
                  </td>
                  <td className="py-3.5 px-3 font-medium text-slate-700">
                    {cust.phone}
                  </td>
                  <td className="py-3.5 px-3 text-slate-500">
                    {cust.email || '—'}
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-slate-800">
                    {cust.totalVisits} orders
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-1 w-max">
                      <Award className="w-3 h-3 text-rose-600" />
                      <span>{cust.loyaltyPoints} pts</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-extrabold text-slate-900">
                    {settings.currencySymbol} {cust.totalSpent.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-right text-slate-500">
                    {cust.lastVisit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-heading font-bold text-base text-slate-900">
                Register Customer
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="e.g. Ayesha Tariq"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="+92 300 1234567"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="ayesha@gmail.com"
                />
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
                  Create Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
