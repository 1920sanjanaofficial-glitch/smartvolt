import React, { useState, useEffect } from 'react';
import { 
  QrCode, CreditCard, Banknote, ShieldCheck, 
  CheckCircle2, Loader2, ArrowLeft, Copy, Check, Clock 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PaymentView: React.FC = () => {
  const { cart, placeOrder, setCurrentView, currentUser } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'qr_code' | 'card_netbanking' | 'cash_pickup'>('qr_code');
  const [upiIdInput, setUpiIdInput] = useState('smartvolt@icici');
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(300); // 5 min countdown

  // 5 minute countdown simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setTimerSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText('smartvolt@icici');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    setError('');

    try {
      // Simulate gateway verification latency (1.2s)
      await new Promise(r => setTimeout(r, 1200));

      const order = await placeOrder(
        paymentMethod,
        currentUser.address || 'SmartVolt Experience Center, Mumbai',
        currentUser.phone,
        paymentMethod === 'cash_pickup'
      );

      setIsProcessing(false);
      setCurrentView('order-confirmation', order);
    } catch (err: any) {
      setIsProcessing(false);
      setError(err?.message || 'Payment processing failed. Please retry.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title */}
      <div className="pb-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Payment & Billing Authorization</h1>
          <p className="text-xs text-slate-400 mt-1">
            Secure 256-bit encrypted checkout. Verified instant GST invoice dispatch.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-mono text-amber-400 bg-amber-950/40 border border-amber-900/60 px-2.5 py-1 rounded-lg">
          <Clock className="w-3.5 h-3.5" />
          <span>Session: {formatTimer(timerSeconds)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left: Payment Method Tabs */}
        <div className="md:col-span-5 space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Select Payment Method
          </label>

          <button
            type="button"
            onClick={() => setPaymentMethod('qr_code')}
            className={`w-full p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
              paymentMethod === 'qr_code'
                ? 'bg-sky-600/10 border-sky-500 text-white shadow-sm'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <QrCode className="w-5 h-5 text-sky-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-white">Instant UPI QR Code</div>
              <div className="text-[11px] text-slate-400">GPay, PhonePe, Paytm, BHIM</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod('upi')}
            className={`w-full p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
              paymentMethod === 'upi'
                ? 'bg-sky-600/10 border-sky-500 text-white shadow-sm'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="w-5 h-5 rounded bg-sky-500/20 text-sky-400 flex items-center justify-center font-mono font-bold text-[10px]">
              VPA
            </div>
            <div>
              <div className="text-xs font-bold text-white">Direct UPI ID / VPA</div>
              <div className="text-[11px] text-slate-400">Collect request to your UPI App</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod('card_netbanking')}
            className={`w-full p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
              paymentMethod === 'card_netbanking'
                ? 'bg-sky-600/10 border-sky-500 text-white shadow-sm'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <CreditCard className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-white">Cards & NetBanking</div>
              <div className="text-[11px] text-slate-400">Visa, Mastercard, RuPay, Corporate</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod('cash_pickup')}
            className={`w-full p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
              paymentMethod === 'cash_pickup'
                ? 'bg-sky-600/10 border-sky-500 text-white shadow-sm'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <Banknote className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-white">Cash on Shop Pickup</div>
              <div className="text-[11px] text-slate-400">Pay cash upon testing at Center</div>
            </div>
          </button>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 space-y-1">
            <p>• Zero payment gateway convenience fees.</p>
            <p>• No card or CVV details are ever retained.</p>
          </div>
        </div>

        {/* Right: Payment Interface Container */}
        <div className="md:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          
          {/* UPI QR Code Mode */}
          {paymentMethod === 'qr_code' && (
            <div className="text-center space-y-4">
              <div className="p-4 bg-white rounded-2xl inline-block shadow-lg mx-auto">
                {/* Clean Scalable QR Representation */}
                <div className="w-44 h-44 bg-slate-950 p-2 rounded-lg flex flex-col items-center justify-between border-2 border-slate-900">
                  <div className="w-full flex justify-between">
                    <div className="w-8 h-8 border-4 border-white bg-slate-950 flex items-center justify-center">
                      <div className="w-3 h-3 bg-white" />
                    </div>
                    <div className="flex flex-col gap-1 w-12">
                      <div className="h-1 bg-white/70 w-full" />
                      <div className="h-1 bg-white/70 w-2/3" />
                      <div className="h-1 bg-white/70 w-full" />
                    </div>
                    <div className="w-8 h-8 border-4 border-white bg-slate-950 flex items-center justify-center">
                      <div className="w-3 h-3 bg-white" />
                    </div>
                  </div>

                  <div className="my-auto text-center">
                    <span className="text-[10px] font-mono font-bold text-sky-400 tracking-wider">SMARTVOLT</span>
                    <div className="text-[8px] text-slate-400 font-mono">UPI DYNAMIC QR</div>
                  </div>

                  <div className="w-full flex justify-between items-end">
                    <div className="w-8 h-8 border-4 border-white bg-slate-950 flex items-center justify-center">
                      <div className="w-3 h-3 bg-white" />
                    </div>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-white" />
                      <div className="w-2 h-2 bg-white" />
                      <div className="w-2 h-2 bg-white" />
                    </div>
                    <div className="w-6 h-6 border-2 border-white/60" />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-semibold text-white">Scan with any UPI App to Pay</p>
                <p className="text-[11px] text-slate-400">Google Pay · PhonePe · Paytm · BHIM · Amazon Pay</p>
              </div>

              {/* Copy UPI VPA */}
              <div className="flex items-center justify-center gap-2 pt-1">
                <span className="text-xs font-mono text-slate-300 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                  smartvolt@icici
                </span>
                <button
                  type="button"
                  onClick={handleCopyUpi}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Copy UPI ID"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Direct UPI VPA input mode */}
          {paymentMethod === 'upi' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Enter your UPI VPA / Handle</label>
                <input
                  type="text"
                  placeholder="e.g. yourname@okaxis or 9820012345@paytm"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-sky-500 focus:outline-none"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                A collect request will be sent to your UPI app. Approve within 5 minutes.
              </p>
            </div>
          )}

          {/* Card / Netbanking simulation */}
          {paymentMethod === 'card_netbanking' && (
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Cardholder Name</label>
                <input
                  type="text"
                  defaultValue={currentUser.name}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:border-sky-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Card Number (Simulated Safe Gateway)</label>
                <input
                  type="text"
                  placeholder="•••• •••• •••• 4242"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:border-sky-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Expiry (MM/YY)</label>
                  <input
                    type="text"
                    placeholder="12/28"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">CVV / CVC</label>
                  <input
                    type="password"
                    maxLength={4}
                    placeholder="•••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Cash Pickup mode */}
          {paymentMethod === 'cash_pickup' && (
            <div className="space-y-3 p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <span className="font-semibold text-white">SmartVolt Experience Center Pickup</span>
              <p className="text-slate-400 leading-relaxed">
                Your order units will be physically set aside and tested in our laboratory. Pay via cash or UPI at the pickup counter.
              </p>
              <div className="text-slate-300 font-mono text-[11px] pt-1 border-t border-slate-900">
                Address: SmartVolt Tech Park, Plot 14, MIDC Industrial Area, Andheri East, Mumbai
              </div>
            </div>
          )}

          {error && (
            <p className="text-xs text-rose-400 bg-rose-950/40 border border-rose-900 p-2 rounded">
              {error}
            </p>
          )}

          {/* Confirm & Authorize Button */}
          <div className="pt-2">
            <button
              disabled={isProcessing}
              onClick={handleConfirmPayment}
              className="w-full py-3 text-xs font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-500 disabled:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-950"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-200" />
                  <span>Verifying Payment Gateway Confirmation...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Authorize & Complete Purchase</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Bank-grade 256-bit SSL encrypted connection</span>
          </div>

        </div>

      </div>

    </div>
  );
};
