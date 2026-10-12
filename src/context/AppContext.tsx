import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, UserRole, Medicine, Cosmetic, Supplier, Sale, Customer, 
  AuditLog, SystemSettings, CartItem, SaleItem 
} from '../types';
import { 
  INITIAL_USERS, INITIAL_MEDICINES, INITIAL_COSMETICS, 
  INITIAL_SUPPLIERS, INITIAL_SALES, INITIAL_CUSTOMERS, 
  INITIAL_AUDIT_LOGS, INITIAL_SETTINGS 
} from '../data/initialData';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  currentView: string;
  setCurrentView: (view: string) => void;
  medicines: Medicine[];
  cosmetics: Cosmetic[];
  suppliers: Supplier[];
  sales: Sale[];
  customers: Customer[];
  auditLogs: AuditLog[];
  settings: SystemSettings;
  cart: CartItem[];
  
  // Navigation & Role
  switchRole: (role: UserRole) => void;
  loginAs: (userId: string) => void;
  logout: () => void;
  hasPermission: (module: string) => boolean;

  // Medicine operations
  addMedicine: (med: Omit<Medicine, 'id'>) => void;
  updateMedicine: (id: string, med: Partial<Medicine>) => void;
  deleteMedicine: (id: string) => void;
  quarantineMedicine: (id: string, quarantined: boolean) => void;

  // Cosmetic operations
  addCosmetic: (cos: Omit<Cosmetic, 'id'>) => void;
  updateCosmetic: (id: string, cos: Partial<Cosmetic>) => void;
  deleteCosmetic: (id: string) => void;
  quarantineCosmetic: (id: string, quarantined: boolean) => void;

  // Cart & POS
  addToCart: (item: Medicine | Cosmetic, type: 'MEDICINE' | 'COSMETIC') => { success: boolean; message: string };
  updateCartQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  processCheckout: (
    paymentMethod: 'CASH' | 'CARD' | 'EASYPAISA' | 'BANK',
    customerName?: string,
    customerPhone?: string,
    doctorName?: string,
    prescriptionNumber?: string,
    discountAmount?: number
  ) => { success: boolean; sale?: Sale; error?: string };

  // Suppliers & Customers
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  updateSupplier: (id: string, updates: Partial<Supplier>) => void;
  addCustomer: (cust: Omit<Customer, 'id' | 'totalVisits' | 'totalSpent' | 'loyaltyPoints' | 'lastVisit'>) => void;
  
  // Receiving / Purchasing
  receivePurchaseBatch: (
    itemType: 'MEDICINE' | 'COSMETIC',
    itemId: string,
    quantity: number,
    unitCost: number,
    batchNumber: string,
    expiryDate: string,
    supplierId: string
  ) => void;

  // Settings & System
  updateSettings: (newSettings: Partial<SystemSettings>) => void;
  addAuditLog: (action: string, module: string, details: string) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// LocalStorage Helper
function getStored<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(`pharmaglow_${key}`);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T) {
  try {
    localStorage.setItem(`pharmaglow_${key}`, JSON.stringify(value));
  } catch (e) {
    console.error('LocalStorage write error', e);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => getStored('currentUser', INITIAL_USERS[0]));
  const [currentView, setCurrentView] = useState<string>('landing');
  const [medicines, setMedicines] = useState<Medicine[]>(() => getStored('medicines', INITIAL_MEDICINES));
  const [cosmetics, setCosmetics] = useState<Cosmetic[]>(() => {
    const loaded = getStored('cosmetics', INITIAL_COSMETICS);
    return loaded.map(c => {
      if (c.image && c.image.includes('1608248597359-291b9426f041')) {
        return {
          ...c,
          image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400&auto=format&fit=crop&q=80'
        };
      }
      return c;
    });
  });
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => getStored('suppliers', INITIAL_SUPPLIERS));
  const [sales, setSales] = useState<Sale[]>(() => getStored('sales', INITIAL_SALES));
  const [customers, setCustomers] = useState<Customer[]>(() => getStored('customers', INITIAL_CUSTOMERS));
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => getStored('auditLogs', INITIAL_AUDIT_LOGS));
  const [settings, setSettings] = useState<SystemSettings>(() => getStored('settings', INITIAL_SETTINGS));
  const [cart, setCart] = useState<CartItem[]>([]);

  // Sync state to local storage
  useEffect(() => { setStored('currentUser', currentUser); }, [currentUser]);
  useEffect(() => { setStored('medicines', medicines); }, [medicines]);
  useEffect(() => { setStored('cosmetics', cosmetics); }, [cosmetics]);
  useEffect(() => { setStored('suppliers', suppliers); }, [suppliers]);
  useEffect(() => { setStored('sales', sales); }, [sales]);
  useEffect(() => { setStored('customers', customers); }, [customers]);
  useEffect(() => { setStored('auditLogs', auditLogs); }, [auditLogs]);
  useEffect(() => { setStored('settings', settings); }, [settings]);

  const addAuditLog = (action: string, module: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      userId: currentUser?.id || 'guest',
      userName: currentUser?.name || 'Guest User',
      role: currentUser?.role || 'STAFF',
      action,
      module,
      details
    };
    setAuditLogs(prev => [newLog, ...prev.slice(0, 99)]);
  };

  const switchRole = (role: UserRole) => {
    const matchedUser = INITIAL_USERS.find(u => u.role === role) || {
      id: `u-${role.toLowerCase()}`,
      name: `${role.replace('_', ' ')} Member`,
      email: `${role.toLowerCase()}@pharmaglow.com`,
      role
    };
    setCurrentUser(matchedUser);
    addAuditLog('ROLE_SWITCH', 'Auth', `Switched active profile to ${role} (${matchedUser.name})`);
  };

  const loginAs = (userId: string) => {
    const user = INITIAL_USERS.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      addAuditLog('LOGIN', 'Auth', `User logged in as ${user.name} (${user.role})`);
    }
  };

  const logout = () => {
    addAuditLog('LOGOUT', 'Auth', `User logged out`);
    setCurrentUser(null);
    setCurrentView('login');
  };

  // Role Permissions
  const hasPermission = (module: string): boolean => {
    if (!currentUser) return false;
    const { role } = currentUser;

    if (role === 'SUPER_ADMIN') return true;

    switch (module) {
      case 'dashboard':
        return true;
      case 'pharmacy':
        return ['ADMIN', 'PHARMACIST', 'INVENTORY_MANAGER', 'STAFF'].includes(role);
      case 'cosmetics':
        return ['ADMIN', 'INVENTORY_MANAGER', 'CASHIER', 'STAFF'].includes(role);
      case 'expiry':
        return ['ADMIN', 'PHARMACIST', 'INVENTORY_MANAGER'].includes(role);
      case 'pos':
        return ['ADMIN', 'PHARMACIST', 'CASHIER'].includes(role);
      case 'sales':
        return ['ADMIN', 'PHARMACIST', 'CASHIER', 'INVENTORY_MANAGER'].includes(role);
      case 'purchasing':
        return ['ADMIN', 'INVENTORY_MANAGER'].includes(role);
      case 'suppliers':
        return ['ADMIN', 'INVENTORY_MANAGER'].includes(role);
      case 'customers':
        return ['ADMIN', 'CASHIER', 'PHARMACIST'].includes(role);
      case 'reports':
        return ['ADMIN', 'PHARMACIST', 'INVENTORY_MANAGER'].includes(role);
      case 'ai':
        return true;
      case 'users':
        return false;
      case 'audit':
        return role === 'ADMIN';
      case 'settings':
        return role === 'ADMIN';
      default:
        return false;
    }
  };

  // Medicine operations
  const addMedicine = (med: Omit<Medicine, 'id'>) => {
    const newMed: Medicine = {
      ...med,
      id: `med-${Date.now()}`
    };
    setMedicines(prev => [newMed, ...prev]);
    addAuditLog('ADD_MEDICINE', 'Pharmacy', `Added medicine ${newMed.name} (Batch: ${newMed.batchNumber})`);
  };

  const updateMedicine = (id: string, updates: Partial<Medicine>) => {
    setMedicines(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
    addAuditLog('UPDATE_MEDICINE', 'Pharmacy', `Updated medicine ID: ${id}`);
  };

  const deleteMedicine = (id: string) => {
    const target = medicines.find(m => m.id === id);
    setMedicines(prev => prev.filter(m => m.id !== id));
    addAuditLog('DELETE_MEDICINE', 'Pharmacy', `Deleted medicine ${target?.name || id}`);
  };

  const quarantineMedicine = (id: string, quarantined: boolean) => {
    setMedicines(prev => prev.map(m => m.id === id ? { ...m, isQuarantined: quarantined } : m));
    const target = medicines.find(m => m.id === id);
    addAuditLog(
      quarantined ? 'QUARANTINE_ENABLED' : 'QUARANTINE_RELEASED',
      'Expiry Radar',
      `${quarantined ? 'Quarantined' : 'Released'} medicine ${target?.name} (Batch ${target?.batchNumber})`
    );
  };

  // Cosmetic operations
  const addCosmetic = (cos: Omit<Cosmetic, 'id'>) => {
    const newCos: Cosmetic = {
      ...cos,
      id: `cos-${Date.now()}`
    };
    setCosmetics(prev => [newCos, ...prev]);
    addAuditLog('ADD_COSMETIC', 'Cosmetics', `Added cosmetic ${newCos.name} (${newCos.category})`);
  };

  const updateCosmetic = (id: string, updates: Partial<Cosmetic>) => {
    setCosmetics(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    addAuditLog('UPDATE_COSMETIC', 'Cosmetics', `Updated cosmetic ID: ${id}`);
  };

  const deleteCosmetic = (id: string) => {
    const target = cosmetics.find(c => c.id === id);
    setCosmetics(prev => prev.filter(c => c.id !== id));
    addAuditLog('DELETE_COSMETIC', 'Cosmetics', `Deleted cosmetic ${target?.name || id}`);
  };

  const quarantineCosmetic = (id: string, quarantined: boolean) => {
    setCosmetics(prev => prev.map(c => c.id === id ? { ...c, isQuarantined: quarantined } : c));
    const target = cosmetics.find(c => c.id === id);
    addAuditLog(
      quarantined ? 'QUARANTINE_ENABLED' : 'QUARANTINE_RELEASED',
      'Cosmetics',
      `${quarantined ? 'Quarantined' : 'Released'} cosmetic ${target?.name}`
    );
  };

  // POS / Cart operations
  const addToCart = (item: Medicine | Cosmetic, type: 'MEDICINE' | 'COSMETIC'): { success: boolean; message: string } => {
    // 1. Strict Expiry & Quarantine Validation
    const nowTime = new Date().getTime();
    const expiryTime = new Date(item.expiryDate).getTime();
    if (expiryTime < nowTime || item.isQuarantined) {
      return {
        success: false,
        message: `STRICT COMPLIANCE ALERT: "${item.name}" is ${expiryTime < nowTime ? 'EXPIRED' : 'QUARANTINED'} and strictly prohibited from dispensing.`
      };
    }

    if (item.quantity <= 0) {
      return { success: false, message: `Item "${item.name}" is completely out of stock.` };
    }

    const existingIndex = cart.findIndex(c => c.id === item.id);
    if (existingIndex > -1) {
      const currentQty = cart[existingIndex].quantity;
      if (currentQty + 1 > item.quantity) {
        return { success: false, message: `Cannot add more. Available stock limit is ${item.quantity}.` };
      }
      setCart(prev => prev.map((c, i) => i === existingIndex ? { ...c, quantity: c.quantity + 1 } : c));
      return { success: true, message: `Updated quantity in cart.` };
    } else {
      const rxRequired = type === 'MEDICINE' ? (item as Medicine).prescriptionRequired : false;
      const discount = type === 'COSMETIC' ? ((item as Cosmetic).discountPercent || 0) : 0;
      const newCartItem: CartItem = {
        id: item.id,
        name: item.name,
        type,
        batchNumber: item.batchNumber,
        expiryDate: item.expiryDate,
        unitPrice: item.sellingPrice,
        quantity: 1,
        prescriptionRequired: rxRequired,
        maxStock: item.quantity,
        discountPercent: discount
      };
      setCart(prev => [...prev, newCartItem]);
      return { success: true, message: `Added "${item.name}" to cart.` };
    }
  };

  const updateCartQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev => prev.map(c => {
      if (c.id === id) {
        const validatedQty = Math.min(quantity, c.maxStock);
        return { ...c, quantity: validatedQty };
      }
      return c;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(c => c.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const processCheckout = (
    paymentMethod: 'CASH' | 'CARD' | 'EASYPAISA' | 'BANK',
    customerName: string = 'Walk-in Customer',
    customerPhone?: string,
    doctorName?: string,
    prescriptionNumber?: string,
    discountAmount: number = 0
  ) => {
    if (cart.length === 0) {
      return { success: false, error: 'Cart is empty.' };
    }

    // Double check stock availability
    for (const item of cart) {
      if (item.type === 'MEDICINE') {
        const med = medicines.find(m => m.id === item.id);
        if (!med || med.quantity < item.quantity) {
          return { success: false, error: `Insufficient stock for medicine "${item.name}".` };
        }
      } else {
        const cos = cosmetics.find(c => c.id === item.id);
        if (!cos || cos.quantity < item.quantity) {
          return { success: false, error: `Insufficient stock for cosmetic "${item.name}".` };
        }
      }
    }

    // Build Sale items
    const saleItems: SaleItem[] = cart.map(c => {
      const itemDisc = c.discountPercent ? (c.unitPrice * (c.discountPercent / 100)) * c.quantity : 0;
      const itemSubtotal = (c.unitPrice * c.quantity) - itemDisc;
      return {
        itemId: c.id,
        itemName: c.name,
        itemType: c.type,
        batchNumber: c.batchNumber,
        quantity: c.quantity,
        unitPrice: c.unitPrice,
        discount: itemDisc,
        total: itemSubtotal
      };
    });

    const subtotal = saleItems.reduce((sum, item) => sum + item.total, 0);
    const tax = Number((subtotal * (settings.taxRatePercent / 100)).toFixed(2));
    const finalTotal = Math.max(0, Number((subtotal + tax - discountAmount).toFixed(2)));

    const newSale: Sale = {
      id: `sale-${Date.now()}`,
      invoiceNumber: `PG-INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString(),
      cashierId: currentUser?.id || 'cashier-1',
      cashierName: currentUser?.name || 'Cashier',
      customerName,
      customerPhone,
      items: saleItems,
      subtotal,
      tax,
      discount: discountAmount,
      total: finalTotal,
      paymentMethod,
      doctorName,
      prescriptionNumber
    };

    // Deduct stock from medicines & cosmetics
    setMedicines(prev => prev.map(m => {
      const soldItem = cart.find(c => c.id === m.id && c.type === 'MEDICINE');
      if (soldItem) {
        return { ...m, quantity: Math.max(0, m.quantity - soldItem.quantity) };
      }
      return m;
    }));

    setCosmetics(prev => prev.map(c => {
      const soldItem = cart.find(cartItem => cartItem.id === c.id && cartItem.type === 'COSMETIC');
      if (soldItem) {
        return { ...c, quantity: Math.max(0, c.quantity - soldItem.quantity) };
      }
      return c;
    }));

    // Update Customer record if phone exists
    if (customerPhone) {
      setCustomers(prev => {
        const existingCust = prev.find(cust => cust.phone === customerPhone);
        if (existingCust) {
          return prev.map(cust => cust.phone === customerPhone ? {
            ...cust,
            totalVisits: cust.totalVisits + 1,
            totalSpent: cust.totalSpent + finalTotal,
            loyaltyPoints: cust.loyaltyPoints + Math.floor(finalTotal / 100),
            lastVisit: new Date().toISOString().split('T')[0]
          } : cust);
        } else {
          const newCust: Customer = {
            id: `cust-${Date.now()}`,
            name: customerName,
            phone: customerPhone,
            totalVisits: 1,
            totalSpent: finalTotal,
            loyaltyPoints: Math.floor(finalTotal / 100),
            lastVisit: new Date().toISOString().split('T')[0]
          };
          return [...prev, newCust];
        }
      });
    }

    // Save sale record
    setSales(prev => [newSale, ...prev]);

    // Clear cart
    setCart([]);

    addAuditLog('SALE_PROCESSED', 'POS', `Completed Invoice #${newSale.invoiceNumber} for ${customerName} (${settings.currencySymbol} ${finalTotal})`);

    return { success: true, sale: newSale };
  };

  // Suppliers & Customers
  const addSupplier = (supplier: Omit<Supplier, 'id'>) => {
    const newSup: Supplier = { ...supplier, id: `sup-${Date.now()}` };
    setSuppliers(prev => [...prev, newSup]);
    addAuditLog('ADD_SUPPLIER', 'Suppliers', `Added supplier ${newSup.name}`);
  };

  const updateSupplier = (id: string, updates: Partial<Supplier>) => {
    setSuppliers(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const addCustomer = (cust: Omit<Customer, 'id' | 'totalVisits' | 'totalSpent' | 'loyaltyPoints' | 'lastVisit'>) => {
    const newCust: Customer = {
      ...cust,
      id: `cust-${Date.now()}`,
      totalVisits: 0,
      totalSpent: 0,
      loyaltyPoints: 0,
      lastVisit: new Date().toISOString().split('T')[0]
    };
    setCustomers(prev => [...prev, newCust]);
    addAuditLog('ADD_CUSTOMER', 'Customers', `Registered customer ${newCust.name}`);
  };

  const receivePurchaseBatch = (
    itemType: 'MEDICINE' | 'COSMETIC',
    itemId: string,
    quantity: number,
    unitCost: number,
    batchNumber: string,
    expiryDate: string,
    supplierId: string
  ) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    if (itemType === 'MEDICINE') {
      const med = medicines.find(m => m.id === itemId);
      if (med) {
        setMedicines(prev => prev.map(m => m.id === itemId ? {
          ...m,
          quantity: m.quantity + quantity,
          purchasePrice: unitCost,
          batchNumber,
          expiryDate,
          supplierId,
          supplierName: supplier?.name || m.supplierName
        } : m));
      }
    } else {
      const cos = cosmetics.find(c => c.id === itemId);
      if (cos) {
        setCosmetics(prev => prev.map(c => c.id === itemId ? {
          ...c,
          quantity: c.quantity + quantity,
          purchasePrice: unitCost,
          batchNumber,
          expiryDate,
          supplierId,
          supplierName: supplier?.name || c.supplierName
        } : c));
      }
    }

    addAuditLog('STOCK_RECEIVED', 'Purchasing', `Received ${quantity} units into batch ${batchNumber} (Supplier: ${supplier?.name || 'Standard'})`);
  };

  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    addAuditLog('SETTINGS_UPDATED', 'Settings', 'Updated system preferences and parameters');
  };

  const resetAllData = () => {
    setMedicines(INITIAL_MEDICINES);
    setCosmetics(INITIAL_COSMETICS);
    setSuppliers(INITIAL_SUPPLIERS);
    setSales(INITIAL_SALES);
    setCustomers(INITIAL_CUSTOMERS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setSettings(INITIAL_SETTINGS);
    setCart([]);
    addAuditLog('SYSTEM_RESET', 'System', 'Reset database to pristine default demo state');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        currentView,
        setCurrentView,
        medicines,
        cosmetics,
        suppliers,
        sales,
        customers,
        auditLogs,
        settings,
        cart,
        switchRole,
        loginAs,
        logout,
        hasPermission,
        addMedicine,
        updateMedicine,
        deleteMedicine,
        quarantineMedicine,
        addCosmetic,
        updateCosmetic,
        deleteCosmetic,
        quarantineCosmetic,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        processCheckout,
        addSupplier,
        updateSupplier,
        addCustomer,
        receivePurchaseBatch,
        updateSettings,
        addAuditLog,
        resetAllData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
