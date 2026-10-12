import React from 'react';
import { Printer, X, Check, ShieldCheck, Heart } from 'lucide-react';
import { Sale } from '../types';
import { useApp } from '../context/AppContext';

interface PrintReceiptModalProps {
  sale: Sale;
  onClose: () => void;
}

export const PrintReceiptModal: React.FC<PrintReceiptModalProps> = ({ sale, onClose }) => {
  const { settings } = useApp();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Top Actions (no-print) */}
        <div className="no-print px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-teal-400" />
            <span className="font-semibold text-sm">Official Thermal Tax Invoice</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Receipt Preview (Printable Area) */}
        <div className="p-6 overflow-y-auto bg-slate-50 flex-1">
          <div 
            id="printable-receipt" 
            className="max-w-[340px] mx-auto bg-white p-5 rounded-2xl shadow-sm border border-slate-200 text-slate-800 font-mono text-xs leading-relaxed"
          >
            {/* Store Header */}
            <div className="text-center pb-3 border-b border-dashed border-slate-300">
              <div className="w-14 h-14 mx-auto mb-1.5 rounded-xl overflow-hidden flex items-center justify-center">
                <img src="/pharmaglow-logo.png" alt="PharmaGlow Logo" className="w-full h-full object-contain" />
              </div>
              <h2 className="font-heading font-extrabold text-base tracking-tight text-slate-900">
                {settings.pharmacyName}
              </h2>
              <p className="text-[10px] text-slate-500 uppercase font-sans tracking-wide">
                {settings.tagline}
              </p>
              <p className="text-[10px] text-slate-600 mt-1">{settings.address}</p>
              <p className="text-[10px] text-slate-600">Ph: {settings.phone}</p>
              <p className="text-[9px] text-teal-800 font-bold mt-0.5">License: {settings.licenseNumber}</p>
            </div>

            {/* Invoice Meta */}
            <div className="py-2.5 border-b border-dashed border-slate-300 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">Invoice #:</span>
                <span className="font-bold text-slate-900">{sale.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date & Time:</span>
                <span>{new Date(sale.date).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Cashier:</span>
                <span>{sale.cashierName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Customer:</span>
                <span className="font-semibold">{sale.customerName}</span>
              </div>
              {sale.customerPhone && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Phone:</span>
                  <span>{sale.customerPhone}</span>
                </div>
              )}
              {sale.doctorName && (
                <div className="flex justify-between text-teal-800">
                  <span className="font-semibold">Doctor (Rx):</span>
                  <span>{sale.doctorName}</span>
                </div>
              )}
              {sale.prescriptionNumber && (
                <div className="flex justify-between text-teal-800">
                  <span className="font-semibold">Rx Ref #:</span>
                  <span>{sale.prescriptionNumber}</span>
                </div>
              )}
            </div>

            {/* Line Items Table */}
            <div className="py-2.5 border-b border-dashed border-slate-300">
              <div className="flex justify-between font-bold text-[10px] text-slate-500 uppercase pb-1 border-b border-slate-200">
                <span>Item & Batch</span>
                <span>Qty x Rate</span>
                <span>Total</span>
              </div>

              <div className="divide-y divide-slate-100 py-1">
                {sale.items.map((it, idx) => (
                  <div key={idx} className="py-1.5">
                    <div className="font-bold text-slate-800 text-[11px]">{it.itemName}</div>
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>Batch: {it.batchNumber}</span>
                      <span>{it.quantity} x {settings.currencySymbol} {it.unitPrice}</span>
                      <span className="font-bold text-slate-900">{settings.currencySymbol} {it.total.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="py-2.5 border-b border-dashed border-slate-300 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">Subtotal:</span>
                <span>{settings.currencySymbol} {sale.subtotal.toLocaleString()}</span>
              </div>
              {sale.tax > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Sales Tax ({settings.taxRatePercent}%):</span>
                  <span>{settings.currencySymbol} {sale.tax.toLocaleString()}</span>
                </div>
              )}
              {sale.discount > 0 && (
                <div className="flex justify-between text-rose-600 font-semibold">
                  <span>Discount:</span>
                  <span>- {settings.currencySymbol} {sale.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold pt-1 border-t border-slate-200 text-slate-900">
                <span>Net Total:</span>
                <span className="text-teal-700">{settings.currencySymbol} {sale.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 pt-0.5">
                <span>Payment Mode:</span>
                <span className="font-bold uppercase text-slate-700">{sale.paymentMethod}</span>
              </div>
            </div>

            {/* Barcode & Verification */}
            <div className="text-center pt-3 pb-1 space-y-2">
              <div className="flex justify-center items-center gap-1 font-mono tracking-widest text-[16px] text-slate-700 select-none">
                ||| | |||| | ||| || |||| | || |||
              </div>
              <div className="text-[9px] text-slate-500">
                DRAP & Healthcare Compliant • FEFO Batch Validated
              </div>
              <p className="text-[9px] text-slate-400 italic">
                Thank you for choosing PharmaGlow! Get well soon and stay radiant.
              </p>

              {/* Watermark in receipt */}
              <div className="pt-2 border-t border-slate-100 text-[9px] text-slate-400">
                <span>Developed by Rimsha • rimsha201000@gmail.com</span>
              </div>
            </div>

          </div>
        </div>

        {/* Modal Bottom Actions (no-print) */}
        <div className="no-print p-4 bg-white border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
            <ShieldCheck className="w-4 h-4" /> Stock deducted & synced
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
