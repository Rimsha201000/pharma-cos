import React, { useState } from 'react';
import { 
  BarChart3, Printer, Download, Calendar, DollarSign, 
  TrendingUp, Package, ShieldAlert, Award, FileSpreadsheet 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ReportsView: React.FC = () => {
  const { sales, medicines, cosmetics, suppliers, settings } = useApp();
  const [reportType, setReportType] = useState<'FINANCIAL' | 'EXPIRY' | 'INVENTORY' | 'SUPPLIERS'>('FINANCIAL');

  const now = new Date();
  const getDaysUntilExpiry = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  // 1. Financial stats
  const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
  const totalTax = sales.reduce((sum, s) => sum + s.tax, 0);
  const totalDiscount = sales.reduce((sum, s) => sum + s.discount, 0);
  
  // Inventory valuation
  const medValuation = medicines.reduce((sum, m) => sum + (m.purchasePrice * m.quantity), 0);
  const cosValuation = cosmetics.reduce((sum, c) => sum + (c.purchasePrice * c.quantity), 0);
  const totalValuation = medValuation + cosValuation;

  // Expiry losses (value of expired/quarantined batches)
  const expiredBatches = medicines.filter(m => getDaysUntilExpiry(m.expiryDate) < 0 || m.isQuarantined);
  const expiredLossValue = expiredBatches.reduce((sum, m) => sum + (m.purchasePrice * m.quantity), 0);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    let headers = '';
    let rows: string[] = [];

    if (reportType === 'FINANCIAL') {
      headers = 'InvoiceNumber,Date,Customer,Total,Tax,Discount,PaymentMethod';
      rows = sales.map(s => `"${s.invoiceNumber}","${s.date}","${s.customerName}",${s.total},${s.tax},${s.discount},"${s.paymentMethod}"`);
    } else if (reportType === 'EXPIRY') {
      headers = 'Item,Batch,ExpiryDate,DaysRemaining,Quantity,CostValue,Status';
      rows = medicines.map(m => `"${m.name}","${m.batchNumber}","${m.expiryDate}",${getDaysUntilExpiry(m.expiryDate)},${m.quantity},${m.purchasePrice * m.quantity},"${m.isQuarantined ? 'QUARANTINED' : 'ACTIVE'}"`);
    } else {
      headers = 'Item,Category,Stock,CostPrice,SellingPrice,TotalValuation';
      rows = [
        ...medicines.map(m => `"${m.name}","Pharmacy",${m.quantity},${m.purchasePrice},${m.sellingPrice},${m.purchasePrice * m.quantity}`),
        ...cosmetics.map(c => `"${c.name}","Cosmetic",${c.quantity},${c.purchasePrice},${c.sellingPrice},${c.purchasePrice * c.quantity}`)
      ];
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `PharmaGlow_${reportType}_Report_${new Date().toISOString().split('T')[0]}.csv`);
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
              Enterprise Analytics & Reports
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase">
              Financial & Audit Intelligence
            </span>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Generate verifiable reports for sales, gross profits, FEFO expiry risks, and supplier accounts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Download CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <Printer className="w-4 h-4 text-teal-400" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs text-xs font-semibold">
        {[
          { id: 'FINANCIAL', label: 'Sales & Profit Analysis' },
          { id: 'EXPIRY', label: 'Expiry & Wastage Audit' },
          { id: 'INVENTORY', label: 'Stock Valuation Ledger' },
          { id: 'SUPPLIERS', label: 'Supplier Payables Ledger' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setReportType(tab.id as any)}
            className={`px-4 py-2 rounded-xl transition-all ${
              reportType === tab.id 
                ? 'bg-gradient-to-r from-teal-700 to-teal-800 text-white shadow-sm' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Report Content Body */}
      {reportType === 'FINANCIAL' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <div className="text-xs text-slate-500 font-medium">Gross Sales Inflow</div>
              <div className="text-2xl font-extrabold font-heading text-slate-900 mt-1">
                {settings.currencySymbol} {totalRevenue.toLocaleString()}
              </div>
              <div className="text-xs text-emerald-600 mt-1 font-medium">{sales.length} paid invoices</div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <div className="text-xs text-slate-500 font-medium">Sales Tax Collected</div>
              <div className="text-2xl font-extrabold font-heading text-slate-900 mt-1">
                {settings.currencySymbol} {totalTax.toFixed(2)}
              </div>
              <div className="text-xs text-slate-400 mt-1">At {settings.taxRatePercent}% standard rate</div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <div className="text-xs text-slate-500 font-medium">Discounts Awarded</div>
              <div className="text-2xl font-extrabold font-heading text-rose-600 mt-1">
                {settings.currencySymbol} {totalDiscount.toLocaleString()}
              </div>
              <div className="text-xs text-slate-400 mt-1">Customer loyalty savings</div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <div className="text-xs text-slate-500 font-medium">Average Order Size</div>
              <div className="text-2xl font-extrabold font-heading text-teal-800 mt-1">
                {settings.currencySymbol} {sales.length > 0 ? (totalRevenue / sales.length).toFixed(1) : 0}
              </div>
              <div className="text-xs text-slate-400 mt-1">Per transaction</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="font-heading font-bold text-base text-slate-900 mb-3">Itemized Sales Ledger</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Invoice</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Customer</th>
                    <th className="py-2.5 px-3">Subtotal</th>
                    <th className="py-2.5 px-3">Tax</th>
                    <th className="py-2.5 px-3">Discount</th>
                    <th className="py-2.5 px-3 text-right">Net Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sales.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-bold text-slate-800">{s.invoiceNumber}</td>
                      <td className="py-2.5 px-3 text-slate-500">{new Date(s.date).toLocaleDateString()}</td>
                      <td className="py-2.5 px-3 text-slate-700">{s.customerName}</td>
                      <td className="py-2.5 px-3 text-slate-600">{settings.currencySymbol} {s.subtotal.toFixed(2)}</td>
                      <td className="py-2.5 px-3 text-slate-600">{settings.currencySymbol} {s.tax.toFixed(2)}</td>
                      <td className="py-2.5 px-3 text-rose-600">{settings.currencySymbol} {s.discount.toFixed(2)}</td>
                      <td className="py-2.5 px-3 text-right font-extrabold text-slate-900">
                        {settings.currencySymbol} {s.total.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {reportType === 'EXPIRY' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-red-50 border border-red-200">
              <div className="text-xs text-red-800 font-semibold">Expired & Quarantined Loss</div>
              <div className="text-2xl font-extrabold font-heading text-red-900 mt-1">
                {settings.currencySymbol} {expiredLossValue.toLocaleString()}
              </div>
              <div className="text-xs text-red-700 mt-1">{expiredBatches.length} batches sequestered</div>
            </div>

            <div className="p-5 rounded-3xl bg-amber-50 border border-amber-200">
              <div className="text-xs text-amber-800 font-semibold">Critical Batches (&le;30 Days)</div>
              <div className="text-2xl font-extrabold font-heading text-amber-900 mt-1">
                {medicines.filter(m => getDaysUntilExpiry(m.expiryDate) >= 0 && getDaysUntilExpiry(m.expiryDate) <= 30).length} Batches
              </div>
              <div className="text-xs text-amber-700 mt-1">Requires immediate FEFO priority</div>
            </div>

            <div className="p-5 rounded-3xl bg-teal-50 border border-teal-200">
              <div className="text-xs text-teal-800 font-semibold">Healthy Batches (&gt;90 Days)</div>
              <div className="text-2xl font-extrabold font-heading text-teal-900 mt-1">
                {medicines.filter(m => getDaysUntilExpiry(m.expiryDate) > 90).length} Batches
              </div>
              <div className="text-xs text-teal-700 mt-1">Zero safety risk</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="font-heading font-bold text-base text-slate-900 mb-3">Expiry Risk Audit Ledger</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Medicine</th>
                    <th className="py-2.5 px-3">Batch Number</th>
                    <th className="py-2.5 px-3">Expiry Date</th>
                    <th className="py-2.5 px-3">Days Left</th>
                    <th className="py-2.5 px-3">Quantity</th>
                    <th className="py-2.5 px-3">Cost Valuation</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {medicines.map(m => {
                    const days = getDaysUntilExpiry(m.expiryDate);
                    return (
                      <tr key={m.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-bold text-slate-800">{m.name}</td>
                        <td className="py-2.5 px-3 font-mono text-slate-600">{m.batchNumber}</td>
                        <td className="py-2.5 px-3 text-slate-700">{m.expiryDate}</td>
                        <td className="py-2.5 px-3 font-semibold">
                          {days < 0 ? <span className="text-red-600">Expired ({Math.abs(days)}d)</span> : `${days} days`}
                        </td>
                        <td className="py-2.5 px-3 text-slate-800">{m.quantity}</td>
                        <td className="py-2.5 px-3 text-slate-800">{settings.currencySymbol} {(m.purchasePrice * m.quantity).toLocaleString()}</td>
                        <td className="py-2.5 px-3 text-right">
                          {m.isQuarantined ? (
                            <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-bold text-[9px]">Quarantined</span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[9px]">Active</span>
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
      )}

      {reportType === 'INVENTORY' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-slate-200">
              <div className="text-xs text-slate-500 font-medium">Total Inventory Value (Cost)</div>
              <div className="text-2xl font-extrabold font-heading text-slate-900 mt-1">
                {settings.currencySymbol} {totalValuation.toLocaleString()}
              </div>
            </div>
            <div className="p-5 rounded-3xl bg-white border border-slate-200">
              <div className="text-xs text-slate-500 font-medium">Pharmacy Share</div>
              <div className="text-2xl font-extrabold font-heading text-teal-800 mt-1">
                {settings.currencySymbol} {medValuation.toLocaleString()}
              </div>
            </div>
            <div className="p-5 rounded-3xl bg-white border border-slate-200">
              <div className="text-xs text-slate-500 font-medium">Cosmetics Share</div>
              <div className="text-2xl font-extrabold font-heading text-rose-600 mt-1">
                {settings.currencySymbol} {cosValuation.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}

      {reportType === 'SUPPLIERS' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-heading font-bold text-base text-slate-900">Supplier Outstanding Balances</h3>
          <div className="divide-y divide-slate-100">
            {suppliers.map(s => (
              <div key={s.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-800 text-sm">{s.name}</div>
                  <div className="text-slate-500">{s.contactPerson} • {s.phone}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400">Balance Due</div>
                  <div className="font-extrabold text-sm text-rose-600">
                    {settings.currencySymbol} {s.balanceDue.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
