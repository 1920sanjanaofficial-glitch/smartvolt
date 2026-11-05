import React, { useState } from 'react';
import { 
  Calculator, Plus, Trash2, CheckCircle2, 
  AlertCircle, ShoppingBag, ArrowRight, Sparkles 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { findCheaperCompatibleAlternatives } from '../utils/electricalEngine';

interface PlannedItem {
  product: Product;
  quantity: number;
}

export const BudgetCalculatorView: React.FC = () => {
  const { products, addToCart, setCurrentView } = useApp();

  const [budget, setBudget] = useState<number>(30000);
  const [selectedVoltage, setSelectedVoltage] = useState<number>(12);
  const [plannedItems, setPlannedItems] = useState<PlannedItem[]>(() => {
    // Default initial item
    const match = products.find(p => p.specifications.nominalVoltage === 12 && p.price < 30000);
    return match ? [{ product: match, quantity: 1 }] : [];
  });

  // Calculations
  const subtotal = plannedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const gstAmount = Number((subtotal * 0.18).toFixed(2)); // 18% standard GST
  const deliveryCharges = (subtotal > 3000 || subtotal === 0) ? 0 : 250;
  const discountAmount = subtotal >= 10000 ? 500 : 0;
  const totalAmount = Math.max(0, subtotal + gstAmount + deliveryCharges - discountAmount);
  const remainingBudget = Number((budget - totalAmount).toFixed(2));
  const isOverBudget = remainingBudget < 0;

  // Find products meeting voltage that fit within budget
  const availableBudgetProducts = products.filter(p => {
    const vMatch = selectedVoltage === 0 || p.specifications.nominalVoltage === selectedVoltage;
    return vMatch && p.stockQuantity > 0;
  });

  // If over budget, identify cheaper compatible alternatives for the most expensive item
  const mostExpensiveItem = [...plannedItems].sort((a, b) => b.product.price - a.product.price)[0];
  const cheaperAlternatives = mostExpensiveItem && isOverBudget
    ? findCheaperCompatibleAlternatives(mostExpensiveItem.product, products, budget - (totalAmount - mostExpensiveItem.product.price * mostExpensiveItem.quantity))
    : [];

  const handleAddItem = (prod: Product) => {
    setPlannedItems(prev => {
      const exists = prev.find(i => i.product.id === prod.id);
      if (exists) {
        return prev.map(i => i.product.id === prod.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { product: prod, quantity: 1 }];
    });
  };

  const handleUpdateQty = (prodId: string, delta: number) => {
    setPlannedItems(prev => prev.map(i => {
      if (i.product.id === prodId) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const handleRemoveItem = (prodId: string) => {
    setPlannedItems(prev => prev.filter(i => i.product.id !== prodId));
  };

  const handleReplaceWithAlternative = (oldProdId: string, altProd: Product) => {
    setPlannedItems(prev => prev.map(i => {
      if (i.product.id === oldProdId) {
        return { product: altProd, quantity: i.quantity };
      }
      return i;
    }));
  };

  const handleAddAllToCart = () => {
    plannedItems.forEach(item => {
      addToCart(item.product, item.quantity);
    });
    setCurrentView('cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
          <Calculator className="w-3.5 h-3.5" />
          <span>Interactive Budget Sizing Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Budget-Based Shopping Calculator
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          Set your available expenditure. Assemble compatible battery storage, inverters and accessories. Track live 18% GST, delivery and remaining budget balance in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Budget Config & Product Picker */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Budget Setter Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-white">Target Total Budget</label>
              <div className="text-xl font-bold font-mono text-emerald-400">
                ₹{budget.toLocaleString('en-IN')}
              </div>
            </div>

            {/* Quick preset chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {[5000, 15000, 30000, 50000, 75000, 100000].map(amt => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setBudget(amt)}
                  className={`px-2.5 py-1 text-xs font-mono rounded-lg border transition-colors whitespace-nowrap ${
                    budget === amt
                      ? 'bg-emerald-600 border-emerald-500 text-white font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  ₹{amt.toLocaleString('en-IN')}
                </button>
              ))}
            </div>

            <input
              type="range"
              min="2000"
              max="150000"
              step="1000"
              value={budget}
              onChange={e => setBudget(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />

            <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
              <span>Filter catalog by system voltage:</span>
              <div className="flex items-center gap-1.5 font-mono">
                {[0, 12, 24, 48].map(v => (
                  <button
                    key={v}
                    onClick={() => setSelectedVoltage(v)}
                    className={`px-2 py-0.5 rounded text-[11px] ${
                      selectedVoltage === v
                        ? 'bg-sky-600 text-white font-bold'
                        : 'bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    {v === 0 ? 'All' : `${v}V`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Planned Items Selection Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span>Selected Products in Budget Plan</span>
              <span className="text-xs font-mono text-slate-400">{plannedItems.length} items</span>
            </h3>

            {plannedItems.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl text-xs text-slate-400">
                No items added to plan. Choose products from the catalog list below.
              </div>
            ) : (
              <div className="divide-y divide-slate-800/80">
                {plannedItems.map(({ product, quantity }) => (
                  <div key={product.id} className="py-3.5 flex items-center justify-between gap-3 text-xs">
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="font-semibold text-white truncate">{product.name}</div>
                      <div className="text-slate-400 font-mono text-[11px]">
                        {product.specifications.nominalVoltage}V · {product.specifications.continuousPowerWatts}W · {product.specifications.warrantyMonths}M Warranty
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-slate-700 rounded bg-slate-950">
                        <button
                          onClick={() => handleUpdateQty(product.id, -1)}
                          className="px-2 py-0.5 text-slate-400 hover:text-white"
                        >
                          -
                        </button>
                        <span className="px-2 font-mono text-white font-bold">{quantity}</span>
                        <button
                          onClick={() => handleUpdateQty(product.id, 1)}
                          className="px-2 py-0.5 text-slate-400 hover:text-white"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right w-24">
                        <div className="font-mono font-bold text-white">
                          ₹{(product.price * quantity).toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          ₹{product.price.toLocaleString('en-IN')} each
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemoveItem(product.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Add Catalog Strip */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Compatible Products to Add
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availableBudgetProducts.slice(0, 4).map(prod => (
                <div 
                  key={prod.id} 
                  className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-white truncate">{prod.name}</p>
                    <p className="text-[11px] font-mono text-slate-400">
                      ₹{prod.price.toLocaleString('en-IN')} · {prod.specifications.nominalVoltage}V
                    </p>
                  </div>
                  <button
                    onClick={() => handleAddItem(prod)}
                    className="p-1.5 rounded-md bg-slate-800 hover:bg-sky-600 text-slate-200 hover:text-white transition-colors shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Cost Breakdown & Alternative Suggestions */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Financial Breakdown Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span>Financial Calculation</span>
              <span className="text-[11px] text-slate-400 font-mono">Standard GST 18%</span>
            </h3>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Product Subtotal</span>
                <span className="font-mono text-white">₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">CGST (9%)</span>
                <span className="font-mono text-white">₹{(gstAmount / 2).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">SGST (9%)</span>
                <span className="font-mono text-white">₹{(gstAmount / 2).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Delivery Charges</span>
                <span className="font-mono text-white">
                  {deliveryCharges === 0 ? <span className="text-emerald-400">FREE</span> : `₹${deliveryCharges.toFixed(2)}`}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Volume Order Discount</span>
                  <span className="font-mono">- ₹{discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
                <span className="text-sm font-bold text-white">Total Amount Payable</span>
                <span className="text-xl font-bold font-mono text-white">
                  ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Remaining Budget Status Meter */}
            <div className={`p-4 rounded-xl border ${
              isOverBudget 
                ? 'bg-rose-950/40 border-rose-900/60 text-rose-300' 
                : 'bg-emerald-950/40 border-emerald-900/60 text-emerald-300'
            }`}>
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="flex items-center gap-1.5">
                  {isOverBudget ? <AlertCircle className="w-4 h-4 text-rose-400" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  {isOverBudget ? 'Budget Exceeded' : 'Fits Comfortably in Budget'}
                </span>
                <span className="font-mono text-sm font-bold">
                  {isOverBudget ? `- ₹${Math.abs(remainingBudget).toLocaleString('en-IN')}` : `₹${remainingBudget.toLocaleString('en-IN')} remaining`}
                </span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden mt-2">
                <div 
                  className={`h-full transition-all duration-300 ${isOverBudget ? 'bg-rose-500' : 'bg-emerald-500'}`}
                  style={{ width: `${Math.min(100, (totalAmount / (budget || 1)) * 100)}%` }}
                />
              </div>
            </div>

            {/* Transfer to Cart Button */}
            <button
              disabled={plannedItems.length === 0}
              onClick={handleAddAllToCart}
              className={`w-full py-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
                plannedItems.length === 0
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-950'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add All {plannedItems.length} Products to Shopping Cart</span>
            </button>
          </div>

          {/* Cheaper Compatible Alternatives Section */}
          {/* "If the selected products exceed the budget, suggest cheaper compatible alternatives. Never suggest an incompatible product simply because it is cheaper." */}
          {isOverBudget && (
            <div className="bg-slate-900/90 border border-amber-500/40 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Cheaper Compatible Alternative Suggestions</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Your selected products exceed your budget by ₹{Math.abs(remainingBudget).toLocaleString('en-IN')}. Here are verified compatible alternatives that match your voltage and continuous power needs at a lower price point:
              </p>

              {cheaperAlternatives.length > 0 ? (
                <div className="space-y-3">
                  {cheaperAlternatives.map(alt => (
                    <div 
                      key={alt.id}
                      className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="font-semibold text-white">{alt.name}</div>
                        <div className="text-slate-400 font-mono text-[11px]">
                          ₹{alt.price.toLocaleString('en-IN')} (Save ₹{(mostExpensiveItem.product.price - alt.price).toLocaleString('en-IN')})
                        </div>
                      </div>
                      <button
                        onClick={() => handleReplaceWithAlternative(mostExpensiveItem.product.id, alt)}
                        className="px-3 py-1.5 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 rounded-lg text-xs font-medium whitespace-nowrap transition-colors"
                      >
                        Swap In
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">
                  No cheaper alternatives found that safely satisfy your technical requirements. We do not suggest incompatible lower-voltage units.
                </p>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
