import React, { useState } from 'react';
import { 
  Receipt, Search, Calendar, Printer, Filter, Download, 
  Eye, CheckCircle2, DollarSign, Shield 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Sale } from '../types';
import { PrintReceiptModal } from '../components/PrintReceiptModal';

export const SalesHistoryView: React.FC = () => {
  const { sales, settings } = useApp();
  const [search, setSearch] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('ALL');
  const [selectedSaleToPrint, setSelectedSaleToPrint] = useState<Sale | null>(null);

  const filteredSales = sales.filter(s => {
    const matchesSearch = 
      s.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      s.customerName.toLowerCase().includes(search.toLowerCase()) ||
      (s.customerPhone && s.customerPhone.includes(search));
    const matchesPayment = selectedPayment === 'ALL' || s.paymentMethod === selectedPayment;
    return matchesSearch && matchesPayment;
  });

  const totalSalesRevenue = filteredSales.reduce((sum, s) => sum + s.total, 0);

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['InvoiceNumber,Date,Customer,Phone,ItemsCount,Subtotal,Tax,Discount,Total,PaymentMethod,Doctor,Prescription'];
    const rows = filteredSales.map(s => 
      `"${s.invoiceNumber}","${s.date}","${s.customerName}","${s.customerPhone || ''}",${s.items.length},${s.subtotal},${s.tax},${s.discount},${s.total},"${s.paymentMethod}","${s.doctorName || ''}","${s.prescriptionNumber || ''}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PharmaGlow_Sales_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-slate-200/90 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              Sales Ledger & Tax Invoices
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase">
              Audit Ready
            </span>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Complete transaction history with reprintable receipts and physician Rx records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-2 transition-all shadow-xs"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export Sales CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Metrics Summary Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500">Filtered Revenue</div>
            <div className="text-xl font-bold font-heading text-slate-900 mt-0.5">
              {settings.currencySymbol} {totalSalesRevenue.toLocaleString()}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500">Completed Invoices</div>
            <div className="text-xl font-bold font-heading text-slate-900 mt-0.5">
              {filteredSales.length} Transactions
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
            <Receipt className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500">Rx Documented Orders</div>
            <div className="text-xl font-bold font-heading text-rose-700 mt-0.5">
              {filteredSales.filter(s => s.doctorName).length} Prescriptions
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <Shield className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search invoice #, customer name or phone..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">Payment Mode:</span>
          {['ALL', 'CASH', 'CARD', 'EASYPAISA', 'BANK'].map(p => (
            <button
              key={p}
              onClick={() => setSelectedPayment(p)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${
                selectedPayment === p 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Invoice # & Date</th>
                <th className="py-3.5 px-3">Customer</th>
                <th className="py-3.5 px-3">Items Dispensed</th>
                <th className="py-3.5 px-3">Rx Verification</th>
                <th className="py-3.5 px-3">Payment</th>
                <th className="py-3.5 px-3 text-right">Total Amount</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSales.map(sale => (
                <tr key={sale.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 text-sm">{sale.invoiceNumber}</div>
                    <div className="text-[10px] text-slate-400">
                      {new Date(sale.date).toLocaleString()} • Cashier: {sale.cashierName}
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="font-semibold text-slate-800">{sale.customerName}</div>
                    {sale.customerPhone && (
                      <div className="text-[11px] text-slate-400">{sale.customerPhone}</div>
                    )}
                  </td>

                  <td className="py-3.5 px-3 text-slate-600">
                    <div className="font-medium">{sale.items.length} product(s)</div>
                    <div className="text-[10px] text-slate-400 truncate max-w-xs">
                      {sale.items.map(it => `${it.itemName} (x${it.quantity})`).join(', ')}
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    {sale.doctorName ? (
                      <div>
                        <span className="px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 font-bold text-[9px]">Rx Verified</span>
                        <div className="text-[10px] text-slate-500 mt-0.5">{sale.doctorName}</div>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-[10px]">Over-the-Counter</span>
                    )}
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[10px]">
                      {sale.paymentMethod}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-right font-extrabold text-sm text-slate-900">
                    {settings.currencySymbol} {sale.total.toLocaleString()}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedSaleToPrint(sale)}
                      className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 font-semibold text-xs flex items-center gap-1.5 ml-auto transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5 text-teal-600" />
                      <span>Reprint</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Thermal Receipt Print Modal */}
      {selectedSaleToPrint && (
        <PrintReceiptModal
          sale={selectedSaleToPrint}
          onClose={() => setSelectedSaleToPrint(null)}
        />
      )}

    </div>
  );
};
