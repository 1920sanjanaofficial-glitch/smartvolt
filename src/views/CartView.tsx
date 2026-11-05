import React, { useState } from 'react';
import { 
  ShoppingBag, Trash2, ArrowRight, Tag, 
  ShieldCheck, ArrowLeft, AlertCircle, CheckCircle2 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CartView: React.FC = () => {
  const { 
    cart, updateCartQuantity, removeFromCart, clearCart,
    cartSubtotal, cartGst, cartDelivery, cartDiscount, cartTotal,
    appliedCoupon, applyCoupon, removeCoupon, setCurrentView 
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [couponStatus, setCouponStatus] = useState<{ message: string; isError: boolean } | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponStatus({ message: res.message, isError: !res.success });
    if (res.success) setCouponInput('');
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">Your Shopping Cart is Empty</h2>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Explore our catalog of certified LiFePO4 batteries, pure sine wave inverters, and electrical accessories.
        </p>
        <button
          onClick={() => setCurrentView('catalog')}
          className="px-6 py-2.5 text-xs font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-500 transition-colors shadow-sm"
        >
          Browse Electrical Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Shopping Cart & Order Review</h1>
          <p className="text-xs text-slate-400 mt-1">
            Authoritative stock and physical compatibility rechecked for all items.
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear All</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Item List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800/80">
            {cart.map(({ product, quantity }) => (
              <div key={product.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                
                {/* Thumbnail & Specs */}
                <div className="flex items-center gap-4 min-w-0">
                  <div 
                    onClick={() => setCurrentView('product-detail', product)}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shrink-0 cursor-pointer"
                  >
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <span className="text-[10px] font-mono text-slate-500">{product.sku}</span>
                    <h3 
                      onClick={() => setCurrentView('product-detail', product)}
                      className="text-xs sm:text-sm font-bold text-white hover:text-sky-300 transition-colors truncate cursor-pointer max-w-md"
                    >
                      {product.name}
                    </h3>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2">
                      <span className="font-mono text-sky-400">{product.specifications.nominalVoltage}V</span>
                      <span>·</span>
                      <span className="font-mono">{product.specifications.continuousPowerWatts}W</span>
                      <span>·</span>
                      <span>{product.specifications.warrantyMonths}M Warranty</span>
                    </div>
                  </div>
                </div>

                {/* Quantity Controls & Line Total */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  <div className="flex items-center border border-slate-700 rounded-lg bg-slate-950 overflow-hidden">
                    <button
                      onClick={() => updateCartQuantity(product.id, quantity - 1)}
                      className="px-2.5 py-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-xs font-mono font-bold text-white">{quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(product.id, quantity + 1)}
                      className="px-2.5 py-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right w-24">
                    <div className="text-sm font-bold text-white font-mono tabular-nums">
                      ₹{(product.price * quantity).toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      ₹{product.price.toLocaleString('en-IN')} ea
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>

          <button
            onClick={() => setCurrentView('catalog')}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-sky-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping Hardware</span>
          </button>
        </div>

        {/* Right: Order Summary & Coupon */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Coupon Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-sky-400" />
              <span>Discount Coupon</span>
            </h3>

            {appliedCoupon ? (
              <div className="flex items-center justify-between p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-xs">
                <div>
                  <span className="font-mono font-bold text-emerald-400">{appliedCoupon.code}</span>
                  <span className="text-[11px] text-slate-400 block">
                    {appliedCoupon.discountType === 'percentage' ? `${appliedCoupon.discountValue}% Off applied` : `₹${appliedCoupon.discountValue} Off applied`}
                  </span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-rose-400 hover:text-rose-300 font-semibold text-xs"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. VOLT10 or ENERGY500"
                  value={couponInput}
                  onChange={e => setCouponInput(e.target.value.toUpperCase())}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white uppercase font-mono focus:border-sky-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium transition-colors"
                >
                  Apply
                </button>
              </form>
            )}

            {couponStatus && (
              <p className={`text-xs ${couponStatus.isError ? 'text-rose-400' : 'text-emerald-400'}`}>
                {couponStatus.message}
              </p>
            )}

            <div className="text-[10px] text-slate-500 font-mono">
              Try code: <button onClick={() => applyCoupon('VOLT10')} className="text-sky-400 hover:underline">VOLT10</button> (10% off) or <button onClick={() => applyCoupon('ENERGY500')} className="text-sky-400 hover:underline">ENERGY500</button> (₹500 off)
            </div>
          </div>

          {/* Billing Breakdown */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white">Order Price Summary</h3>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Products Subtotal</span>
                <span className="font-mono text-white">₹{cartSubtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">CGST (9%)</span>
                <span className="font-mono text-white">₹{(cartGst / 2).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">SGST (9%)</span>
                <span className="font-mono text-white">₹{(cartGst / 2).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Delivery Charges</span>
                <span className="font-mono text-white">
                  {cartDelivery === 0 ? <span className="text-emerald-400">FREE</span> : `₹${cartDelivery.toFixed(2)}`}
                </span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Coupon Discount</span>
                  <span className="font-mono">- ₹{cartDiscount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
                <span className="text-sm font-bold text-white">Grand Total Amount</span>
                <span className="text-xl font-bold font-mono text-white">
                  ₹{cartTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <button
              onClick={() => setCurrentView('checkout')}
              className="w-full py-3 text-xs font-semibold text-white bg-sky-600 rounded-xl hover:bg-sky-500 transition-all flex items-center justify-center gap-2 shadow-md shadow-sky-950"
            >
              <span>Proceed to Delivery & Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Inventory is actively held for your order session.</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
