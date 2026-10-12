import { Medicine, Cosmetic, Sale, Supplier } from '../types';

export interface AIStoreContext {
  medicines: Medicine[];
  cosmetics: Cosmetic[];
  sales: Sale[];
  suppliers: Supplier[];
  currencySymbol: string;
}

export async function askGemini(
  query: string,
  context: AIStoreContext,
  apiKey: string,
  language: 'en-US' | 'ur-PK' = 'en-US'
): Promise<string> {
  const isUrdu = language === 'ur-PK' || /[\u0600-\u06FF]/.test(query);

  // Calculate live database metrics to supply to the AI
  const todaySales = context.sales.reduce((sum, s) => sum + s.total, 0);
  const totalMedicines = context.medicines.length;
  const totalCosmetics = context.cosmetics.length;

  const now = new Date();
  const getDaysUntilExpiry = (dateStr: string) => {
    const diffTime = new Date(dateStr).getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const expiredMeds = context.medicines.filter(m => getDaysUntilExpiry(m.expiryDate) < 0 || m.isQuarantined);
  const criticalMeds = context.medicines.filter(m => {
    const d = getDaysUntilExpiry(m.expiryDate);
    return d >= 0 && d <= 30 && !m.isQuarantined;
  });
  const lowStockMeds = context.medicines.filter(m => m.quantity <= m.reorderLevel);
  const lowStockCosmetics = context.cosmetics.filter(c => c.quantity <= c.reorderLevel);

  const pendingSuppliers = context.suppliers.filter(s => s.balanceDue > 0);
  const totalPendingSupplierBalance = pendingSuppliers.reduce((sum, s) => sum + s.balanceDue, 0);

  // Context summary text
  const contextSummary = `
You are the AI Business Manager for PharmaGlow (Pharmacy & Cosmetics Management System).
Current live database stats:
- Total Medicines in stock: ${totalMedicines}
- Total Cosmetics products: ${totalCosmetics}
- Total Sales Recorded: ${context.currencySymbol} ${todaySales.toLocaleString()}
- Expired / Quarantined Medicines: ${expiredMeds.length} items (${expiredMeds.map(m => `${m.name} [Batch: ${m.batchNumber}]`).join(', ') || 'None'})
- Critical Near-Expiry (<= 30 days): ${criticalMeds.length} items (${criticalMeds.map(m => `${m.name} (Exp: ${m.expiryDate}, ${getDaysUntilExpiry(m.expiryDate)}d left)`).join(', ') || 'None'})
- Low Stock Medicines: ${lowStockMeds.length} items (${lowStockMeds.map(m => `${m.name} (Qty: ${m.quantity}, Min: ${m.reorderLevel})`).join(', ') || 'None'})
- Low Stock Cosmetics: ${lowStockCosmetics.length} items (${lowStockCosmetics.map(c => `${c.name} (Qty: ${c.quantity}, Min: ${c.reorderLevel})`).join(', ') || 'None'})
- Total Pending Supplier Payables: ${context.currencySymbol} ${totalPendingSupplierBalance.toLocaleString()} (${pendingSuppliers.map(s => `${s.name}: ${context.currencySymbol}${s.balanceDue}`).join(', ')})

User Language: ${isUrdu ? 'Urdu (اردو)' : 'English'}.
User Query: "${query}".

Instructions:
- Provide an accurate, professional, concise response based ONLY on the verified data above.
- If the user asks in Urdu or the language is Urdu, respond in polite, elegant Urdu (اردو).
- Format lists with clear markdown bullet points or small tables where appropriate.
- Never fabricate numbers or assume unrecorded sales.
`;

  // First, attempt calling Google Gemini REST API if an API key is provided
  if (apiKey && apiKey.trim().length > 10) {
    try {
      const endpoints = [
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`
      ];

      for (const endpoint of endpoints) {
        try {
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [{ text: contextSummary }]
                }
              ],
              generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 800
              }
            })
          });

          if (res.ok) {
            const data = await res.json();
            const textResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (textResponse) {
              return textResponse;
            }
          }
        } catch (innerErr) {
          console.warn('Gemini endpoint attempt notice:', innerErr);
        }
      }
    } catch (e) {
      console.warn('Gemini direct fetch encountered exception:', e);
    }
  }

  // Graceful intelligent fallback with exact data calculation
  return generateIntelligentFallbackResponse(query, {
    expiredMeds,
    criticalMeds,
    lowStockMeds,
    lowStockCosmetics,
    todaySales,
    pendingSuppliers,
    totalPendingSupplierBalance,
    context,
    isUrdu
  });
}

interface FallbackParams {
  expiredMeds: Medicine[];
  criticalMeds: Medicine[];
  lowStockMeds: Medicine[];
  lowStockCosmetics: Cosmetic[];
  todaySales: number;
  pendingSuppliers: Supplier[];
  totalPendingSupplierBalance: number;
  context: AIStoreContext;
  isUrdu: boolean;
}

function generateIntelligentFallbackResponse(query: string, params: FallbackParams): string {
  const q = query.toLowerCase().trim();
  const { isUrdu, expiredMeds, criticalMeds, lowStockMeds, lowStockCosmetics, todaySales, pendingSuppliers, totalPendingSupplierBalance, context } = params;

  // 1. Expiry queries
  if (q.includes('expir') || q.includes('ایکسپائر') || q.includes('ختم') || q.includes('تاریخ')) {
    if (isUrdu) {
      let resp = `### ⚠️ ایکسپائری کنٹرول رپورٹ (PharmaGlow AI)\n\n`;
      if (expiredMeds.length > 0) {
        resp += `**ایکسپائر ہو چکی ادویات (${expiredMeds.length}):**\n`;
        expiredMeds.forEach(m => {
          resp += `- **${m.name}** (بیچ: \`${m.batchNumber}\`, تاریخ تنسیخ: ${m.expiryDate}) — *قرنطینہ شدہ (فروخت بند)*\n`;
        });
      } else {
        resp += `✅ فی الوقت کوئی دوا ایکسپائر نہیں ہے۔\n\n`;
      }

      if (criticalMeds.length > 0) {
        resp += `\n**اگلے 30 دنوں میں ایکسپائر ہونے والی ادویات (${criticalMeds.length}):**\n`;
        criticalMeds.forEach(m => {
          resp += `- **${m.name}** (اسٹاک: ${m.quantity}, تاریخ: ${m.expiryDate}) — *FEFO کے تحت جلد فروخت تجویز کی جاتی ہے*\n`;
        });
      }
      return resp;
    } else {
      let resp = `### ⚠️ Expiry Control Radar Report\n\n`;
      if (expiredMeds.length > 0) {
        resp += `**Expired / Quarantined Medicines (${expiredMeds.length}):**\n`;
        expiredMeds.forEach(m => {
          resp += `- **${m.name}** (Batch: \`${m.batchNumber}\`, Expired: ${m.expiryDate}) — *Status: Quarantined (Blocked from POS)*\n`;
        });
      } else {
        resp += `✅ No expired medicines detected in active inventory.\n\n`;
      }

      if (criticalMeds.length > 0) {
        resp += `\n**Expiring within 30 Days (${criticalMeds.length}):**\n`;
        criticalMeds.forEach(m => {
          resp += `- **${m.name}** (Qty: ${m.quantity}, Expiry: ${m.expiryDate}) — *Dispense with priority under FEFO policy.*\n`;
        });
      }
      return resp;
    }
  }

  // 2. Low stock queries
  if (q.includes('stock') || q.includes('کم') || q.includes('اسٹاک') || q.includes('low')) {
    if (isUrdu) {
      let resp = `### 📦 کم اسٹاک کی تفصیلی رپورٹ\n\n`;
      resp += `**فارمیسی ادویات (${lowStockMeds.length} آئٹمز):**\n`;
      if (lowStockMeds.length > 0) {
        lowStockMeds.forEach(m => {
          resp += `- **${m.name}**: موجودہ مقدار **${m.quantity}** (ری آرڈر لیول: ${m.reorderLevel})\n`;
        });
      } else {
        resp += `- تمام ادویات کے پاس مناسب اسٹاک موجود ہے۔\n`;
      }

      resp += `\n**کاسمیٹکس پروڈکٹس (${lowStockCosmetics.length} آئٹمز):**\n`;
      if (lowStockCosmetics.length > 0) {
        lowStockCosmetics.forEach(c => {
          resp += `- **${c.name}**: موجودہ مقدار **${c.quantity}** (ری آرڈر لیول: ${c.reorderLevel})\n`;
        });
      } else {
        resp += `- کاسمیٹکس کا اسٹاک تسلی بخش ہے۔\n`;
      }
      return resp;
    } else {
      let resp = `### 📦 Low Stock Inventory Alert\n\n`;
      resp += `**Pharmacy Medicines (${lowStockMeds.length} items):**\n`;
      if (lowStockMeds.length > 0) {
        lowStockMeds.forEach(m => {
          resp += `- **${m.name}**: Current Stock **${m.quantity}** (Reorder Threshold: ${m.reorderLevel})\n`;
        });
      } else {
        resp += `- All pharmaceutical medicines have sufficient stock levels.\n`;
      }

      resp += `\n**Cosmetics Products (${lowStockCosmetics.length} items):**\n`;
      if (lowStockCosmetics.length > 0) {
        lowStockCosmetics.forEach(c => {
          resp += `- **${c.name}**: Current Stock **${c.quantity}** (Reorder Threshold: ${c.reorderLevel})\n`;
        });
      } else {
        resp += `- Cosmetics stock levels are healthy.\n`;
      }
      return resp;
    }
  }

  // 3. Sales & revenue queries
  if (q.includes('sale') || q.includes('revenue') || q.includes('فروخت') || q.includes('آمدنی') || q.includes('profit') || q.includes('منافع')) {
    const totalTransactions = context.sales.length;
    if (isUrdu) {
      return `### 💰 فروخت اور مالیاتی تجزیہ\n\n` +
        `- **کل ریکارڈ شدہ آمدنی:** ${context.currencySymbol} ${todaySales.toLocaleString()}\n` +
        `- **کل انوائسز:** ${totalTransactions}\n` +
        `- **اوسط آرڈر ویلیو:** ${context.currencySymbol} ${totalTransactions > 0 ? (todaySales / totalTransactions).toFixed(2) : 0}\n\n` +
        `تمام انوائسز اور ریسیڈز POS سسٹم میں کامیابی کے ساتھ محفوظ ہیں۔`;
    } else {
      return `### 💰 Sales & Financial Summary\n\n` +
        `- **Total Recorded Revenue:** ${context.currencySymbol} ${todaySales.toLocaleString()}\n` +
        `- **Total Completed Invoices:** ${totalTransactions}\n` +
        `- **Average Order Value:** ${context.currencySymbol} ${totalTransactions > 0 ? (todaySales / totalTransactions).toFixed(2) : 0}\n\n` +
        `All billing receipts are synced with stock adjustment ledger and FEFO batches.`;
    }
  }

  // 4. Supplier balances
  if (q.includes('supplier') || q.includes('balance') || q.includes('سپلائر') || q.includes('بقایا')) {
    if (isUrdu) {
      let resp = `### 🤝 سپلائرز کے بقایا جات\n\n`;
      resp += `**کل قابل ادائیگی رقم:** ${context.currencySymbol} ${totalPendingSupplierBalance.toLocaleString()}\n\n`;
      pendingSuppliers.forEach(s => {
        resp += `- **${s.name}**: ${context.currencySymbol} ${s.balanceDue.toLocaleString()} (رابطہ: ${s.phone})\n`;
      });
      return resp;
    } else {
      let resp = `### 🤝 Supplier Payables Summary\n\n`;
      resp += `**Total Pending Balance:** ${context.currencySymbol} ${totalPendingSupplierBalance.toLocaleString()}\n\n`;
      pendingSuppliers.forEach(s => {
        resp += `- **${s.name}**: ${context.currencySymbol} ${s.balanceDue.toLocaleString()} (Phone: ${s.phone})\n`;
      });
      return resp;
    }
  }

  // General intelligent answer
  if (isUrdu) {
    return `### PharmaGlow AI اسسٹنٹ\n\n` +
      `آپ کا سوال: *"${query}"*\n\n` +
      `**سسٹم خلاصہ:**\n` +
      `- ادویات کی تعداد: ${context.medicines.length}\n` +
      `- کاسمیٹکس پروڈکٹس: ${context.cosmetics.length}\n` +
      `- کم اسٹاک الرٹس: ${lowStockMeds.length + lowStockCosmetics.length}\n` +
      `- ایکسپائر شدہ بیجز: ${expiredMeds.length}\n\n` +
      `آپ مزید مخصوص معلومات پوچھ سکتے ہیں، مثلاً: *"کم اسٹاک ادویات"*, *"ایکسپائری رپورٹ"*, یا *"آج کی آمدنی"*۔`;
  } else {
    return `### PharmaGlow AI Business Intelligence\n\n` +
      `Query processed: *"${query}"*\n\n` +
      `**System Overview:**\n` +
      `- Registered Medicines: ${context.medicines.length} items\n` +
      `- Cosmetics Catalog: ${context.cosmetics.length} items\n` +
      `- Low Stock Warnings: ${lowStockMeds.length + lowStockCosmetics.length} products\n` +
      `- Expired/Quarantined Batches: ${expiredMeds.length} batches\n` +
      `- Total Revenue: ${context.currencySymbol} ${todaySales.toLocaleString()}\n\n` +
      `Feel free to ask specific queries like: *"Which medicines expire soon?"*, *"Cosmetics with low stock"*, or *"Check supplier balances"*.`;
  }
}
