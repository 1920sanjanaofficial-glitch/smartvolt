import React, { useState } from 'react';
import { 
  Truck, Store, ShieldCheck, ArrowRight, 
  ArrowLeft, Phone, MapPin, User, Mail 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CheckoutView: React.FC = () => {
  const { 
    currentUser, updateUserProfile, cart, cartSubtotal, 
    cartGst, cartDelivery, cartDiscount, cartTotal, 
    setCurrentView 
  } = useApp();

  const [deliveryMethod, setDeliveryMethod] = useState<'shipping' | 'shop_pickup'>('shipping');
  const [fullName, setFullName] = useState(currentUser.name || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [address, setAddress] = useState(currentUser.address || '');
  const [city, setCity] = useState(currentUser.city || '');
  const [pincode, setPincode] = useState(currentUser.pincode || '');
  const [errorMsg, setErrorMsg] = useState('');

  const finalDeliveryCharge = deliveryMethod === 'shop_pickup' ? 0 : cartDelivery;
  const grandTotal = Math.max(0, cartSubtotal + cartGst + finalDeliveryCharge - cartDiscount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      setErrorMsg('Full name and WhatsApp mobile number are mandatory.');
      return;
    }
    if (deliveryMethod === 'shipping' && (!address.trim() || !pincode.trim())) {
      setErrorMsg('Delivery street address and PIN code are required for shipping.');
      return;
    }

    // Save profile updates
    updateUserProfile({
      name: fullName,
      email,
      phone,
      address,
      city,
      pincode
    });

    // Proceed to Payment
    setCurrentView('payment', {
      deliveryMethod,
      customerName: fullName,
      customerPhone: phone,
      deliveryAddress: deliveryMethod === 'shop_pickup' ? 'SmartVolt Experience Center, Mumbai' : `${address}, ${city} - ${pincode}`,
      totalPayable: grandTotal
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title */}
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-bold tracking-tight text-white">Delivery & Contact Information</h1>
        <p className="text-xs text-slate-400 mt-1">
          Provide your WhatsApp mobile number so we can instantly deliver your GST tax invoice upon payment confirmation.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left: Delivery details form */}
        <div className="md:col-span-7 space-y-6">
          
          {/* Delivery Method Selector */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Fulfillment Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeliveryMethod('shipping')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  deliveryMethod === 'shipping'
                    ? 'bg-sky-600/10 border-sky-500 text-white'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1 text-sky-400 font-semibold text-xs">
                  <Truck className="w-4 h-4" />
                  <span>Courier Shipping</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {cartDelivery === 0 ? 'FREE Doorstep Delivery' : 'Standard Insured Freight'}
                </p>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryMethod('shop_pickup')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  deliveryMethod === 'shop_pickup'
                    ? 'bg-sky-600/10 border-sky-500 text-white'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1 text-emerald-400 font-semibold text-xs">
                  <Store className="w-4 h-4" />
                  <span>Shop Pickup (Instant)</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Pick up directly at SmartVolt Center (Zero Delivery Fee)
                </p>
              </button>
            </div>
          </div>

          {/* Contact Fields */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Recipient & Invoicing Profile
            </h3>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Customer Name</label>
              <div className="relative">
                <User className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Rajesh Sharma"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:border-sky-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">WhatsApp Mobile Number</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98200 12345"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white font-mono focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5 block">Invoice will be sent here automatically.</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="rajesh@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Address fields (if shipping) */}
            {deliveryMethod === 'shipping' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Delivery Street Address</label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                    <textarea
                      required
                      rows={2}
                      placeholder="Flat / Floor / Street / Landmark..."
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:border-sky-500 focus:outline-none resize-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">City</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mumbai"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:border-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Postal PIN Code</label>
                    <input
                      type="text"
                      required
                      placeholder="400069"
                      value={pincode}
                      onChange={e => setPincode(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:border-sky-500 focus:outline-none"
                    />
                  </div>
                </div>
              </>
            )}

            {errorMsg && (
              <p className="text-xs text-rose-400 bg-rose-950/40 border border-rose-900 p-2 rounded">
                {errorMsg}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => setCurrentView('cart')}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-sky-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Cart Review</span>
          </button>
        </div>

        {/* Right: Compact Order Review */}
        <div className="md:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <h3 className="text-sm font-bold text-white">Order Review</h3>

          <div className="divide-y divide-slate-800/80 text-xs">
            {cart.map(({ product, quantity }) => (
              <div key={product.id} className="py-2.5 flex justify-between gap-3">
                <div>
                  <span className="font-semibold text-white">{product.name}</span>
                  <span className="text-[11px] text-slate-500 block font-mono">
                    Qty: {quantity} · {product.specifications.nominalVoltage}V
                  </span>
                </div>
                <span className="font-mono text-slate-200">
                  ₹{(product.price * quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800 space-y-1.5 text-xs text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Subtotal</span>
              <span className="font-mono text-white">₹{cartSubtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">GST (18%)</span>
              <span className="font-mono text-white">₹{cartGst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Delivery</span>
              <span className="font-mono text-white">
                {finalDeliveryCharge === 0 ? <span className="text-emerald-400">FREE</span> : `₹${finalDeliveryCharge.toFixed(2)}`}
              </span>
            </div>
            {cartDiscount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Discount</span>
                <span className="font-mono">- ₹{cartDiscount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            )}
            <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
              <span className="text-sm font-bold text-white">Total Payable</span>
              <span className="text-xl font-bold font-mono text-white">
                ₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 text-xs font-semibold text-white bg-sky-600 rounded-xl hover:bg-sky-500 transition-all flex items-center justify-center gap-2 shadow-md shadow-sky-950"
          >
            <span>Proceed to Payment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </form>

    </div>
  );
};
