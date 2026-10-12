import React, { useState } from 'react';
import { 
  ShoppingCart, Search, Barcode, Trash2, Plus, Minus, 
  CreditCard, Banknote, Smartphone, Building, Printer, 
  User, CheckCircle2, ShieldAlert, AlertTriangle, Pill, 
  Sparkles, X, HeartHandshake, Mic
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { Medicine, Cosmetic, Sale } from '../types';
import { PrintReceiptModal } from '../components/PrintReceiptModal';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';

export const POSView: React.FC = () => {
  const { 
    medicines, cosmetics, cart, addToCart, updateCartQuantity, 
    removeFromCart, clearCart, processCheckout, customers, settings 
  } = useApp();

  const [activeCatalogTab, setActiveCatalogTab] = useState<'ALL' | 'MEDICINE' | 'COSMETIC'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');

  // Checkout Form State
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CARD' | 'EASYPAISA' | 'BANK'>('CASH');
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customDiscount, setCustomDiscount] = useState<number>(0);

  // Prescription Dialog State
  const [showRxModal, setShowRxModal] = useState(false);
  const [doctorName, setDoctorName] = useState('');
  const [prescriptionNumber, setPrescriptionNumber] = useState('');

  // Completed Receipt Modal State
  const [completedSale, setCompletedSale] = useState<Sale | null>(null);

  // Voice Search inside POS
  const { isListening, startListening, stopListening } = useVoiceRecognition((text) => {
    setSearchQuery(text);
  });

  const now = new Date();
  const getDaysUntilExpiry = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  // Barcode Fast Enter
  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;

    const matchedMed = medicines.find(m => m.barcode === barcodeInput.trim());
    if (matchedMed) {
      const res = addToCart(matchedMed, 'MEDICINE');
      if (!res.success) alert(res.message);
      setBarcodeInput('');
      return;
    }

    const matchedCos = cosmetics.find(c => c.barcode === barcodeInput.trim());
    if (matchedCos) {
      const res = addToCart(matchedCos, 'COSMETIC');
      if (!res.success) alert(res.message);
      setBarcodeInput('');
      return;
    }

    alert(`No item found with barcode "${barcodeInput}"`);
    setBarcodeInput('');
  };

  // Filter Catalog
  const filteredCatalog = [
    ...(activeCatalogTab !== 'COSMETIC' ? medicines.map(m => ({ ...m, itemType: 'MEDICINE' as const })) : []),
    ...(activeCatalogTab !== 'MEDICINE' ? cosmetics.map(c => ({ ...c, itemType: 'COSMETIC' as const })) : [])
  ].filter(item => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.name.toLowerCase().includes(q) ||
      ('genericName' in item && item.genericName.toLowerCase().includes(q)) ||
      ('brand' in item && item.brand.toLowerCase().includes(q)) ||
      item.barcode.includes(q)
    );
  });

  // Check if prescription verification is needed
  const requiresPrescription = cart.some(item => item.prescriptionRequired);

  // Totals
  const subtotal = cart.reduce((sum, item) => {
    const itemDisc = item.discountPercent ? (item.unitPrice * (item.discountPercent / 100)) * item.quantity : 0;
    return sum + (item.unitPrice * item.quantity) - itemDisc;
  }, 0);

  const tax = Number((subtotal * (settings.taxRatePercent / 100)).toFixed(2));
  const finalTotal = Math.max(0, Number((subtotal + tax - customDiscount).toFixed(2)));

  const handleAttemptCheckout = () => {
    if (cart.length === 0) {
      alert('Cart is empty. Please add products to check out.');
      return;
    }

    // If prescription is required and doctor details not yet filled, open Rx modal
    if (requiresPrescription && (!doctorName || !prescriptionNumber)) {
      setShowRxModal(true);
      return;
    }

    executeFinalCheckout();
  };

  const executeFinalCheckout = () => {
    const result = processCheckout(
      paymentMethod,
      customerName,
      customerPhone,
      doctorName || undefined,
      prescriptionNumber || undefined,
      customDiscount
    );

    if (result.success && result.sale) {
      // Confetti burst
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      setCompletedSale(result.sale);
      setShowRxModal(false);
      setDoctorName('');
      setPrescriptionNumber('');
      setCustomDiscount(0);
    } else {
      alert(result.error || 'Failed to process checkout transaction.');
    }
  };

  const handleCustomerSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cid = e.target.value;
    setSelectedCustomerId(cid);
    const cust = customers.find(c => c.id === cid);
    if (cust) {
      setCustomerName(cust.name);
      setCustomerPhone(cust.phone);
    } else {
      setCustomerName('Walk-in Customer');
      setCustomerPhone('');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-slate-200/90 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              Rapid Point of Sale (POS)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase">
              FEFO & Rx Verified
            </span>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Barcode scanning, voice lookup, inventory sync, and instant thermal receipt generation.
          </p>
        </div>

        {/* Barcode Fast Scan Input */}
        <form onSubmit={handleBarcodeSubmit} className="flex items-center gap-2">
          <div className="relative">
            <Barcode className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              placeholder="Scan Barcode & Enter..."
              className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:border-teal-500 w-52"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold"
          >
            Add
          </button>
        </form>
      </div>

      {/* Main Grid: Catalog Left (7 cols) + Cart Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Product Catalog */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Tabs & Search */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl text-xs font-semibold">
                <button
                  onClick={() => setActiveCatalogTab('ALL')}
                  className={`px-3 py-1.5 rounded-xl transition-colors ${
                    activeCatalogTab === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  All Products
                </button>
                <button
                  onClick={() => setActiveCatalogTab('MEDICINE')}
                  className={`px-3 py-1.5 rounded-xl flex items-center gap-1 transition-colors ${
                    activeCatalogTab === 'MEDICINE' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  <Pill className="w-3.5 h-3.5" /> Pharmacy
                </button>
                <button
                  onClick={() => setActiveCatalogTab('COSMETIC')}
                  className={`px-3 py-1.5 rounded-xl flex items-center gap-1 transition-colors ${
                    activeCatalogTab === 'COSMETIC' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" /> Cosmetics
                </button>
              </div>

              {/* Voice Search Button */}
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isListening 
                    ? 'bg-rose-500 text-white shadow-md animate-pulse' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
                title="Voice Search Products"
              >
                <Mic className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isListening ? 'Listening...' : 'Voice Search'}</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by brand, generic, or barcode..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[620px] overflow-y-auto pr-1">
            {filteredCatalog.map(item => {
              const isMed = item.itemType === 'MEDICINE';
              const daysLeft = getDaysUntilExpiry(item.expiryDate);
              const isExpired = daysLeft < 0 || item.isQuarantined;

              return (
                <div
                  key={`${item.itemType}-${item.id}`}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    isExpired 
                      ? 'bg-red-50/50 border-red-200 opacity-60' 
                      : 'bg-white border-slate-200 hover:border-teal-400 hover:shadow-md'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        {isMed ? <Pill className="w-3.5 h-3.5 text-teal-600" /> : <Sparkles className="w-3.5 h-3.5 text-rose-500" />}
                        <span className="truncate">{item.name}</span>
                      </div>
                      {isMed && (item as Medicine).prescriptionRequired && (
                        <span className="px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 font-bold text-[9px] shrink-0">
                          Rx
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-500 mt-1">
                      {isMed ? (item as Medicine).genericName : (item as Cosmetic).brand}
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100 pt-1.5">
                      <span>Batch: {item.batchNumber}</span>
                      <span className={daysLeft <= 30 ? 'text-amber-600 font-bold' : ''}>
                        Exp: {item.expiryDate}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
                    <div>
                      <div className="font-bold text-sm text-slate-900">
                        {settings.currencySymbol} {item.sellingPrice}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Stock: <span className="font-bold">{item.quantity}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        const res = addToCart(item, item.itemType);
                        if (!res.success) alert(res.message);
                      }}
                      disabled={isExpired || item.quantity <= 0}
                      className={`px-3 py-1.5 rounded-xl font-semibold text-xs flex items-center gap-1 shadow-xs transition-all ${
                        isExpired 
                          ? 'bg-red-100 text-red-700 cursor-not-allowed'
                          : isMed 
                            ? 'bg-teal-700 hover:bg-teal-800 text-white' 
                            : 'bg-rose-600 hover:bg-rose-700 text-white'
                      }`}
                    >
                      <Plus className="w-3 h-3" />
                      <span>{isExpired ? 'Blocked' : 'Add'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right Column: POS Cart & Checkout */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 shadow-lg p-5 space-y-4">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-teal-700" />
              <h2 className="font-heading font-bold text-lg text-slate-900">Current Register</h2>
            </div>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
              >
                Clear Cart
              </button>
            )}
          </div>

          {/* Cart Items List */}
          <div className="space-y-2 max-h-72 overflow-y-auto divide-y divide-slate-100">
            {cart.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-30" />
                No items in register cart. Select or scan products to start billing.
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="pt-2 pb-1 flex items-center justify-between text-xs">
                  <div className="flex-1 pr-2">
                    <div className="font-bold text-slate-900 flex items-center gap-1">
                      <span>{item.name}</span>
                      {item.prescriptionRequired && (
                        <span className="px-1 py-0.2 rounded bg-rose-100 text-rose-700 font-bold text-[9px]">Rx</span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {settings.currencySymbol} {item.unitPrice} each • Batch: {item.batchNumber}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 bg-slate-50 hover:bg-slate-100 text-slate-600"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 font-bold text-slate-800">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 bg-slate-50 hover:bg-slate-100 text-slate-600"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="w-16 text-right font-bold text-slate-900">
                      {settings.currencySymbol} {(item.unitPrice * item.quantity).toFixed(2)}
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-400 hover:text-red-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Rx Mandatory Warning Banner */}
          {requiresPrescription && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs flex items-start gap-2 text-rose-800">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <div>
                <span className="font-bold">Prescription Medication Detected (Rx):</span>
                <p className="text-[11px] text-rose-700 mt-0.5">
                  Doctor Name & Rx Reference # must be entered before billing completion.
                </p>
              </div>
            </div>
          )}

          {/* Customer Selection & Loyalty */}
          <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
            <label className="font-semibold text-slate-700 block">Customer Account & Loyalty</label>
            <select
              value={selectedCustomerId}
              onChange={handleCustomerSelect}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
            >
              <option value="">Walk-in Customer</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.phone}) — {c.loyaltyPoints} Points
                </option>
              ))}
            </select>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-1.5 text-xs">
            <label className="font-semibold text-slate-700 block">Payment Method</label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { id: 'CASH', label: 'Cash', icon: Banknote },
                { id: 'CARD', label: 'Card', icon: CreditCard },
                { id: 'EASYPAISA', label: 'EasyPaisa', icon: Smartphone },
                { id: 'BANK', label: 'Bank', icon: Building }
              ].map(method => {
                const Icon = method.icon;
                const isSel = paymentMethod === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id as any)}
                    className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                      isSel 
                        ? 'bg-teal-50 border-teal-500 text-teal-800 font-bold' 
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[10px]">{method.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Discount Input */}
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-600 font-medium">Extra Bill Discount:</span>
            <div className="flex items-center gap-1">
              <span className="text-slate-400">{settings.currencySymbol}</span>
              <input
                type="number"
                min="0"
                value={customDiscount}
                onChange={(e) => setCustomDiscount(Number(e.target.value))}
                className="w-20 p-1 text-right bg-slate-50 border border-slate-200 rounded-lg font-bold"
              />
            </div>
          </div>

          {/* Calculation Summary */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span>{settings.currencySymbol} {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Tax ({settings.taxRatePercent}%):</span>
              <span>{settings.currencySymbol} {tax.toFixed(2)}</span>
            </div>
            {customDiscount > 0 && (
              <div className="flex justify-between text-rose-600 font-semibold">
                <span>Discount:</span>
                <span>- {settings.currencySymbol} {customDiscount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-extrabold text-slate-900 pt-1.5 border-t border-slate-200 font-heading">
              <span>Grand Total:</span>
              <span className="text-teal-800">{settings.currencySymbol} {finalTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Checkout Action Button */}
          <button
            onClick={handleAttemptCheckout}
            disabled={cart.length === 0}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-700 to-teal-900 hover:from-teal-800 hover:to-teal-950 text-white font-bold text-sm shadow-lg shadow-teal-900/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            <span>Complete Checkout & Print</span>
          </button>

        </div>

      </div>

      {/* Mandatory Prescription (Rx) Modal */}
      {showRxModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center gap-2 text-rose-600 mb-2">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="font-heading font-bold text-base text-slate-900">
                Prescription Verification Required
              </h3>
            </div>
            <p className="text-slate-500 mb-4">
              Your cart contains controlled or prescription medication. In compliance with drug administration standards, please enter doctor details:
            </p>

            <div className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Prescribing Doctor *</label>
                <input
                  type="text"
                  required
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  placeholder="e.g. Dr. Asad Rauf, MBBS"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Prescription Serial # *</label>
                <input
                  type="text"
                  required
                  value={prescriptionNumber}
                  onChange={(e) => setPrescriptionNumber(e.target.value)}
                  placeholder="e.g. RX-2026-9041"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowRxModal(false)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeFinalCheckout}
                disabled={!doctorName || !prescriptionNumber}
                className="px-5 py-2 rounded-xl bg-teal-700 text-white font-semibold hover:bg-teal-800 disabled:opacity-40"
              >
                Verify & Authorize Sale
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Completed Sale Thermal Receipt Modal */}
      {completedSale && (
        <PrintReceiptModal
          sale={completedSale}
          onClose={() => setCompletedSale(null)}
        />
      )}

    </div>
  );
};
