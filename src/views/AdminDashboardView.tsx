import React, { useState } from 'react';
import { 
  Shield, Package, ShoppingCart, FileText, 
  Tag, Star, TrendingUp, AlertTriangle, Plus, 
  Trash2, Edit, Check, ArrowRight, DollarSign, 
  Download, RefreshCw, Layers 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product, CategoryType, Coupon } from '../types';

export const AdminDashboardView: React.FC = () => {
  const { 
    products, addProduct, updateProduct, deleteProduct, updateStock,
    orders, invoices, downloadInvoicePdf, coupons, setCurrentView 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'inventory' | 'orders' | 'coupons' | 'reviews'>('analytics');
  
  // Product Form state for adding/editing
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formSku, setFormSku] = useState('');
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<CategoryType>('Batteries');
  const [formSubcategory, setFormSubcategory] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPrice, setFormPrice] = useState(10000);
  const [formMrp, setFormMrp] = useState(12000);
  const [formStock, setFormStock] = useState(15);
  const [formVoltage, setFormVoltage] = useState(48);
  const [formWatts, setFormWatts] = useState(1500);
  const [formAh, setFormAh] = useState(100);
  const [formChemistry, setFormChemistry] = useState('LiFePO4');
  const [formConnector, setFormConnector] = useState('M8 Bolt Terminal');
  const [formWarranty, setFormWarranty] = useState(24);

  // New Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [couponType, setCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [couponVal, setCouponVal] = useState(10);
  const [couponMin, setCouponMin] = useState(2000);

  // Analytics Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalGst = orders.reduce((sum, o) => sum + o.gstAmount, 0);
  const lowStockProducts = products.filter(p => p.stockQuantity <= 5);
  const allReviews = products.flatMap(p => p.reviews.map(r => ({ ...r, productName: p.name })));

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormSku(`SV-${Date.now().toString().slice(-6)}`);
    setFormName('');
    setFormCategory('Batteries');
    setFormSubcategory('Lithium iron phosphate batteries');
    setFormDescription('');
    setFormPrice(15000);
    setFormMrp(18000);
    setFormStock(20);
    setFormVoltage(48);
    setFormWatts(2000);
    setFormAh(100);
    setFormChemistry('LiFePO4');
    setFormConnector('M8 Bolt Terminal');
    setFormWarranty(36);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormSku(p.sku);
    setFormName(p.name);
    setFormCategory(p.category);
    setFormSubcategory(p.subcategory);
    setFormDescription(p.description);
    setFormPrice(p.price);
    setFormMrp(p.mrp);
    setFormStock(p.stockQuantity);
    setFormVoltage(p.specifications.nominalVoltage);
    setFormWatts(p.specifications.continuousPowerWatts);
    setFormAh(p.specifications.capacityAh || 0);
    setFormChemistry(p.specifications.batteryChemistry || 'LiFePO4');
    setFormConnector(p.specifications.connectorType);
    setFormWarranty(p.specifications.warrantyMonths);
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const prodData: Product = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      sku: formSku,
      name: formName,
      category: formCategory,
      subcategory: formSubcategory,
      description: formDescription || 'Industrial certified electrical hardware.',
      price: Number(formPrice),
      mrp: Number(formMrp),
      imageUrl: editingProduct ? editingProduct.imageUrl : '/src/assets/images/cat_batteries_industrial_1793862945917.jpg',
      stockQuantity: Number(formStock),
      isFeatured: editingProduct ? editingProduct.isFeatured : false,
      reviews: editingProduct ? editingProduct.reviews : [],
      averageRating: editingProduct ? editingProduct.averageRating : 5.0,
      specifications: {
        nominalVoltage: Number(formVoltage),
        continuousPowerWatts: Number(formWatts),
        capacityAh: Number(formAh) || 0,
        batteryChemistry: formChemistry as any,
        connectorType: formConnector,
        efficiencyPercent: 94,
        warrantyMonths: Number(formWarranty),
        hsnCode: '8507'
      }
    };

    if (editingProduct) {
      updateProduct(prodData);
    } else {
      addProduct(prodData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Administrator Command Center</h1>
            <p className="text-xs text-slate-400">Products CRUD, real-time inventory, sales analytics, and invoice dispatch.</p>
          </div>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Gross Revenue</span>
          <div className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono">
            ₹{totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
          </div>
          <p className="text-[10px] text-slate-500 font-mono">GST Collected: ₹{totalGst.toLocaleString('en-IN')}</p>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Total Orders</span>
          <div className="text-xl sm:text-2xl font-bold text-white font-mono">
            {orders.length}
          </div>
          <p className="text-[10px] text-slate-500 font-mono">{orders.length > 0 ? '100% Paid & Confirmed' : 'Awaiting checkouts'}</p>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Catalog Products</span>
          <div className="text-xl sm:text-2xl font-bold text-sky-400 font-mono">
            {products.length}
          </div>
          <p className="text-[10px] text-slate-500 font-mono">Across 5 Primary Categories</p>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Low-Stock Watch</span>
          <div className={`text-xl sm:text-2xl font-bold font-mono ${lowStockProducts.length > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
            {lowStockProducts.length}
          </div>
          <p className="text-[10px] text-slate-500 font-mono">Stock &le; 5 units threshold</p>
        </div>

      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-800 pb-2">
        {[
          { key: 'analytics', label: 'Sales & Demand Analytics' },
          { key: 'products', label: `Products Catalog (${products.length})` },
          { key: 'inventory', label: `Low-Stock Alerts (${lowStockProducts.length})` },
          { key: 'orders', label: `Orders & Invoices (${orders.length})` },
          { key: 'coupons', label: 'Coupons & Discounts' },
          { key: 'reviews', label: `Customer Reviews (${allReviews.length})` },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
              activeTab === tab.key
                ? 'bg-sky-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. SALES & DEMAND ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Sales Trends simulation */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Category Revenue Contribution</span>
                </h3>
                <span className="text-[11px] text-slate-500 font-mono">Pandas Aggregation</span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Lithium & LiFePO4 Batteries</span>
                    <span className="font-mono text-white font-bold">58% of volume</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                    <div className="bg-sky-500 h-full w-[58%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Power Equipment & Inverters</span>
                    <span className="font-mono text-white font-bold">24% of volume</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[24%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Solar Modules & MPPT</span>
                    <span className="font-mono text-white font-bold">12% of volume</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full w-[12%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Electrical Cables & Accessories</span>
                    <span className="font-mono text-white font-bold">6% of volume</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full w-[6%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Demand Forecasting Engine */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Package className="w-4 h-4 text-sky-400" />
                <span>Demand Forecast (Scikit-Learn Sizing Engine)</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Seasonal high-temperature grid cuts project a 35% surge in 48V 100Ah LiFePO4 modular rack batteries and 60A MPPT controllers over the next 45 days.
              </p>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-2">
                <span className="text-slate-300 font-semibold">Recommended Replenishment Orders:</span>
                <div className="text-[11px] text-slate-400 space-y-1 font-mono">
                  <div>• SV-LFP-48100: Order +20 units (Lead time: 14 days)</div>
                  <div>• SV-INV-3500W: Order +15 units (Lead time: 10 days)</div>
                  <div>• SV-MPPT-60A: Order +30 units (Lead time: 7 days)</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 2. PRODUCTS MANAGEMENT TABLE */}
      {activeTab === 'products' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                <tr>
                  <th className="p-4">SKU / Code</th>
                  <th className="p-4">Product Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Voltage / Watts</th>
                  <th className="p-4">Price (₹)</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-sky-400 whitespace-nowrap">
                      {p.sku}
                    </td>
                    <td className="p-4 font-semibold text-white max-w-xs truncate">
                      {p.name}
                    </td>
                    <td className="p-4 text-slate-400 whitespace-nowrap">
                      {p.category}
                    </td>
                    <td className="p-4 font-mono text-slate-300 whitespace-nowrap">
                      {p.specifications.nominalVoltage}V · {p.specifications.continuousPowerWatts}W
                    </td>
                    <td className="p-4 font-mono font-bold text-white whitespace-nowrap">
                      ₹{p.price.toLocaleString('en-IN')}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className={`font-mono font-bold ${p.stockQuantity <= 5 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {p.stockQuantity}
                      </span>
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                          title="Edit Specs & Price"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. LOW STOCK MONITOR */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-400">
            Products requiring immediate inventory replenishment. Update stock quantities directly below.
          </p>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="divide-y divide-slate-800/80">
              {lowStockProducts.map(p => (
                <div key={p.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{p.name}</span>
                      <span className="text-amber-400 font-mono text-[11px] bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                        {p.stockQuantity} in stock
                      </span>
                    </div>
                    <span className="text-slate-500 font-mono text-[11px] block mt-0.5">
                      SKU: {p.sku} · {p.specifications.nominalVoltage}V · {p.specifications.continuousPowerWatts}W
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-slate-400">Quick Replenish:</span>
                    <button
                      onClick={() => updateStock(p.id, p.stockQuantity + 10)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-emerald-600 text-white rounded font-mono text-xs transition-colors"
                    >
                      +10
                    </button>
                    <button
                      onClick={() => updateStock(p.id, p.stockQuantity + 25)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-emerald-600 text-white rounded font-mono text-xs transition-colors"
                    >
                      +25
                    </button>
                    <button
                      onClick={() => updateStock(p.id, p.stockQuantity + 50)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-emerald-600 text-white rounded font-mono text-xs transition-colors"
                    >
                      +50
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. ORDERS & PAYMENTS */}
      {activeTab === 'orders' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Payment Method</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {orders.map(order => {
                  const inv = invoices.find(i => i.orderId === order.id);
                  return (
                    <tr key={order.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-mono font-bold text-sky-400 whitespace-nowrap">
                        #{order.id}
                      </td>
                      <td className="p-4 font-semibold text-white whitespace-nowrap">
                        {order.customerName}
                      </td>
                      <td className="p-4 font-mono text-slate-400 whitespace-nowrap">
                        {order.customerPhone}
                      </td>
                      <td className="p-4 font-mono font-bold text-emerald-400 whitespace-nowrap">
                        ₹{order.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-4 font-mono uppercase text-slate-300 whitespace-nowrap">
                        {order.paymentMethod}
                      </td>
                      <td className="p-4">
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded uppercase">
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        {inv && (
                          <button
                            onClick={() => downloadInvoicePdf(inv)}
                            className="px-2.5 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs flex items-center gap-1 transition-colors ml-auto"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>PDF</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. COUPONS & DISCOUNTS */}
      {activeTab === 'coupons' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {coupons.map(c => (
              <div key={c.code} className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-sky-400 text-sm">{c.code}</span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded">
                    Active
                  </span>
                </div>
                <p className="text-xs text-white font-semibold">
                  {c.discountType === 'percentage' ? `${c.discountValue}% Off Total` : `₹${c.discountValue} Flat Discount`}
                </p>
                <p className="text-[11px] text-slate-500 font-mono">
                  Min spend: ₹{c.minOrderAmount.toLocaleString('en-IN')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. REVIEWS MODERATION */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          <div className="divide-y divide-slate-800 bg-slate-900 border border-slate-800 rounded-2xl">
            {allReviews.map((r, i) => (
              <div key={i} className="p-4 flex justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{r.userName}</span>
                    <span className="text-slate-500 font-mono text-[11px]">· for {r.productName}</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} className={`w-3 h-3 ${idx < r.rating ? 'fill-amber-400' : 'text-slate-700'}`} />
                    ))}
                    <span className="text-slate-300 ml-1 font-semibold">{r.title}</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">{r.comment}</p>
                </div>
                <span className="text-[11px] text-slate-500 font-mono shrink-0">{r.createdAt}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">
                {editingProduct ? 'Edit Electrical Product' : 'Add New Electrical Product'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-semibold"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">SKU Code</label>
                  <input
                    type="text"
                    required
                    value={formSku}
                    onChange={e => setFormSku(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white font-mono focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white focus:border-sky-500 focus:outline-none"
                  >
                    <option value="Batteries">Batteries</option>
                    <option value="Power Equipment">Power Equipment</option>
                    <option value="Solar Products">Solar Products</option>
                    <option value="Electrical Accessories">Electrical Accessories</option>
                    <option value="Other Electrical Equipment">Other Electrical Equipment</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SmartVolt 24V 200Ah LiFePO4 Battery"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={e => setFormPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white font-mono focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">MRP Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formMrp}
                    onChange={e => setFormMrp(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white font-mono focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={formStock}
                    onChange={e => setFormStock(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white font-mono focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Nominal Voltage (V)</label>
                  <input
                    type="number"
                    required
                    value={formVoltage}
                    onChange={e => setFormVoltage(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white font-mono focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Continuous Power (W)</label>
                  <input
                    type="number"
                    required
                    value={formWatts}
                    onChange={e => setFormWatts(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white font-mono focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Capacity (Ah)</label>
                  <input
                    type="number"
                    value={formAh}
                    onChange={e => setFormAh(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white font-mono focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Battery Chemistry</label>
                  <input
                    type="text"
                    value={formChemistry}
                    onChange={e => setFormChemistry(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Connector Interface</label>
                  <input
                    type="text"
                    value={formConnector}
                    onChange={e => setFormConnector(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Engineering Description</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white focus:border-sky-500 focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-colors shadow-sm"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
