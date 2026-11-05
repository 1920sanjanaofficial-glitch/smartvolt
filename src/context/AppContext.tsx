import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, CartItem, Order, Invoice, Coupon, UserProfile, 
  NotificationLog, CategoryType, ProductReview 
} from '../types';
import { INITIAL_PRODUCTS, INITIAL_COUPONS } from '../data/initialProducts';
import { generateClientPdfInvoice } from '../utils/pdfGenerator';
import { dispatchOrderNotifications } from '../utils/notifications';

interface AppContextType {
  // Navigation & View
  currentView: string;
  setCurrentView: (view: string, payload?: any) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;

  // Catalog & Inventory
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  updateStock: (productId: string, quantity: number) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: CategoryType | 'All';
  setSelectedCategory: (cat: CategoryType | 'All') => void;

  // Comparison
  comparisonList: Product[];
  addToComparison: (product: Product) => boolean;
  removeFromComparison: (productId: string) => void;
  clearComparison: () => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => { success: boolean; message: string };
  updateCartQuantity: (productId: string, quantity: number) => { success: boolean; message: string };
  removeFromCart: (productId: string) => void;
  clearCart: () => void;

  // Coupons & Pricing
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  cartSubtotal: number;
  cartGst: number;
  cartDelivery: number;
  cartDiscount: number;
  cartTotal: number;

  // Orders & Billing
  orders: Order[];
  invoices: Invoice[];
  latestOrder: Order | null;
  placeOrder: (paymentMethod: Order['paymentMethod'], address: string, phone: string, pickup: boolean) => Promise<Order>;
  downloadInvoicePdf: (invoice: Invoice) => void;

  // User & Admin Auth
  currentUser: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  isAdmin: boolean;
  setIsAdmin: (admin: boolean) => void;

  // Notifications
  notifications: NotificationLog[];

  // Reviews
  addReview: (productId: string, rating: number, title: string, comment: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load products from localStorage or default
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('smartvolt_products_v3');
      if (saved) return JSON.parse(saved);
      // Clean up outdated storage
      localStorage.removeItem('smartvolt_products');
      localStorage.removeItem('smartvolt_products_v2');
      localStorage.setItem('smartvolt_products_v3', JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [currentView, setCurrentViewRaw] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'All'>('All');

  // Comparison
  const [comparisonList, setComparisonList] = useState<Product[]>([]);

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('smartvolt_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Coupons
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // User Profile
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('smartvolt_user');
    return saved ? JSON.parse(saved) : {
      id: 'usr-101',
      name: 'Rajesh Sharma',
      email: 'rajesh.sharma@example.com',
      phone: '+91 98201 54321',
      address: 'Flat 402, Green Meadows, Andheri East',
      city: 'Mumbai',
      pincode: '400069',
      role: 'customer'
    };
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Orders & Invoices
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('smartvolt_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('smartvolt_invoices');
    return saved ? JSON.parse(saved) : [];
  });

  const [latestOrder, setLatestOrder] = useState<Order | null>(null);
  const [notifications, setNotifications] = useState<NotificationLog[]>([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('smartvolt_products_v3', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('smartvolt_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('smartvolt_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('smartvolt_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('smartvolt_user', JSON.stringify(currentUser));
  }, [currentUser]);

  // Enhanced navigation setter
  const setCurrentView = (view: string, payload?: any) => {
    if (view === 'product-detail' && payload) {
      setSelectedProduct(payload);
    }
    setCurrentViewRaw(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart Calculations
  const cartSubtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const cartGst = Number((cartSubtotal * 0.18).toFixed(2)); // 18% standard GST
  const cartDelivery = (cartSubtotal > 3000 || cartSubtotal === 0) ? 0 : 250;

  let cartDiscount = 0;
  if (appliedCoupon && cartSubtotal >= appliedCoupon.minOrderAmount) {
    if (appliedCoupon.discountType === 'percentage') {
      cartDiscount = Number(((cartSubtotal * appliedCoupon.discountValue) / 100).toFixed(2));
    } else {
      cartDiscount = appliedCoupon.discountValue;
    }
  }

  const cartTotal = Math.max(0, Number((cartSubtotal + cartGst + cartDelivery - cartDiscount).toFixed(2)));

  // Cart Actions
  const addToCart = (product: Product, quantity = 1) => {
    const freshProduct = products.find(p => p.id === product.id) || product;
    if (freshProduct.stockQuantity < quantity) {
      return { success: false, message: `Only ${freshProduct.stockQuantity} units available in stock.` };
    }

    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        const newQty = existing.quantity + quantity;
        if (newQty > freshProduct.stockQuantity) {
          return prev;
        }
        return prev.map(item => 
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      return [...prev, { product: freshProduct, quantity }];
    });

    return { success: true, message: `Added ${product.name} to cart.` };
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    const freshProduct = products.find(p => p.id === productId);
    if (!freshProduct) return { success: false, message: 'Product not found.' };

    if (quantity > freshProduct.stockQuantity) {
      return { success: false, message: `Cannot exceed stock limit of ${freshProduct.stockQuantity} units.` };
    }

    if (quantity <= 0) {
      removeFromCart(productId);
      return { success: true, message: 'Removed from cart.' };
    }

    setCart(prev => prev.map(item => 
      item.product.id === productId ? { ...item, quantity } : item
    ));

    return { success: true, message: 'Quantity updated.' };
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Comparison Actions (max 4 products)
  const addToComparison = (product: Product): boolean => {
    if (comparisonList.some(p => p.id === product.id)) return true;
    if (comparisonList.length >= 4) {
      return false; // Exceeds limit of 4
    }
    setComparisonList(prev => [...prev, product]);
    return true;
  };

  const removeFromComparison = (productId: string) => {
    setComparisonList(prev => prev.filter(p => p.id !== productId));
  };

  const clearComparison = () => {
    setComparisonList([]);
  };

  // Coupons
  const applyCoupon = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    const found = coupons.find(c => c.code === trimmed && c.isActive);
    if (!found) {
      return { success: false, message: 'Invalid or inactive coupon code.' };
    }
    if (cartSubtotal < found.minOrderAmount) {
      return { success: false, message: `Coupon requires a minimum order of ₹${found.minOrderAmount.toLocaleString('en-IN')}.` };
    }
    setAppliedCoupon(found);
    return { success: true, message: `Coupon ${found.code} applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Place Order with authoritative stock lock & verification
  const placeOrder = async (
    paymentMethod: Order['paymentMethod'], 
    address: string, 
    phone: string, 
    pickup: boolean
  ): Promise<Order> => {
    // 1. Recheck authoritative stock
    for (const item of cart) {
      const currentProd = products.find(p => p.id === item.product.id);
      if (!currentProd || currentProd.stockQuantity < item.quantity) {
        throw new Error(`Stock verification failed for ${item.product.name}. Insufficient stock.`);
      }
    }

    // 2. Decrement inventory safely
    setProducts(prev => prev.map(p => {
      const cartMatch = cart.find(ci => ci.product.id === p.id);
      if (cartMatch) {
        return {
          ...p,
          stockQuantity: Math.max(0, p.stockQuantity - cartMatch.quantity)
        };
      }
      return p;
    }));

    const orderNum = `SV-${1000 + orders.length + 1}`;
    const invoiceNum = `INV-2026-${1000 + orders.length + 1}`;
    const dateStr = new Date().toISOString().split('T')[0];

    const orderItems = cart.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      sku: item.product.sku,
      unitPrice: item.product.price,
      quantity: item.quantity,
      voltageStr: `${item.product.specifications.nominalVoltage}V`,
      wattageStr: `${item.product.specifications.continuousPowerWatts}W`,
      warrantyMonths: item.product.specifications.warrantyMonths,
      imageUrl: item.product.imageUrl
    }));

    const newOrder: Order = {
      id: orderNum,
      userId: currentUser.id,
      customerName: currentUser.name,
      customerPhone: phone || currentUser.phone,
      customerEmail: currentUser.email,
      deliveryAddress: pickup ? 'SmartVolt Experience & Pickup Center, Mumbai' : address,
      deliveryMethod: pickup ? 'shop_pickup' : 'shipping',
      items: orderItems,
      subtotal: cartSubtotal,
      gstAmount: cartGst,
      deliveryCharge: pickup ? 0 : cartDelivery,
      discountAmount: cartDiscount,
      couponCode: appliedCoupon?.code,
      totalAmount: pickup ? Math.max(0, cartSubtotal + cartGst - cartDiscount) : cartTotal,
      paymentMethod,
      paymentStatus: 'successful',
      transactionId: `TXN-${Date.now().toString().slice(-8)}`,
      orderStatus: 'confirmed',
      createdAt: dateStr,
      invoiceId: invoiceNum
    };

    const newInvoice: Invoice = {
      id: invoiceNum,
      orderId: newOrder.id,
      orderNumber: newOrder.id,
      invoiceDate: dateStr,
      customerName: newOrder.customerName,
      customerPhone: newOrder.customerPhone,
      customerEmail: newOrder.customerEmail,
      deliveryAddress: newOrder.deliveryAddress,
      subtotal: newOrder.subtotal,
      cgstAmount: Number((newOrder.gstAmount / 2).toFixed(2)),
      sgstAmount: Number((newOrder.gstAmount / 2).toFixed(2)),
      totalTax: newOrder.gstAmount,
      deliveryCharge: newOrder.deliveryCharge,
      discountAmount: newOrder.discountAmount,
      finalAmount: newOrder.totalAmount,
      paymentStatus: 'successful',
      paymentMethod: newOrder.paymentMethod,
      transactionId: newOrder.transactionId || 'TXN-98231',
      items: orderItems
    };

    setOrders(prev => [newOrder, ...prev]);
    setInvoices(prev => [newInvoice, ...prev]);
    setLatestOrder(newOrder);

    // Send WhatsApp & SMS notifications
    const dispatchedLogs = dispatchOrderNotifications(newOrder);
    setNotifications(prev => [...dispatchedLogs, ...prev]);

    // Clear cart
    clearCart();

    return newOrder;
  };

  const downloadInvoicePdf = (invoice: Invoice) => {
    generateClientPdfInvoice(invoice);
  };

  // Product Admin Operations
  const addProduct = (prod: Product) => {
    setProducts(prev => [prod, ...prev]);
  };

  const updateProduct = (prod: Product) => {
    setProducts(prev => prev.map(p => p.id === prod.id ? prod : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const updateStock = (productId: string, quantity: number) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, stockQuantity: quantity } : p));
  };

  // Customer Reviews
  const addReview = (productId: string, rating: number, title: string, comment: string) => {
    const newRev: ProductReview = {
      id: `rev-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      rating,
      title,
      comment,
      createdAt: new Date().toISOString().split('T')[0],
      isVerifiedPurchase: true
    };

    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const updatedReviews = [newRev, ...p.reviews];
        const avg = updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
        return {
          ...p,
          reviews: updatedReviews,
          averageRating: Number(avg.toFixed(1))
        };
      }
      return p;
    }));
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setCurrentUser(prev => ({ ...prev, ...profile }));
  };

  return (
    <AppContext.Provider value={{
      currentView,
      setCurrentView,
      selectedProduct,
      setSelectedProduct,
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      updateStock,
      searchQuery,
      setSearchQuery,
      selectedCategory,
      setSelectedCategory,
      comparisonList,
      addToComparison,
      removeFromComparison,
      clearComparison,
      cart,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      coupons,
      appliedCoupon,
      applyCoupon,
      removeCoupon,
      cartSubtotal,
      cartGst,
      cartDelivery,
      cartDiscount,
      cartTotal,
      orders,
      invoices,
      latestOrder,
      placeOrder,
      downloadInvoicePdf,
      currentUser,
      updateUserProfile,
      isAdmin,
      setIsAdmin,
      notifications,
      addReview
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
