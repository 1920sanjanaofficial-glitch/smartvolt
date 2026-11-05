import React from 'react';
import { 
  CheckCircle2, Download, MessageSquare, PhoneCall, 
  ArrowRight, ShieldCheck, Printer, ShoppingBag, Send 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';
import { createWhatsAppMessage, generateWhatsAppDirectUrl } from '../utils/notifications';

export const OrderConfirmationView: React.FC = () => {
  const { latestOrder, invoices, downloadInvoicePdf, setCurrentView } = useApp();

  if (!latestOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-slate-400">No recent order located.</p>
        <button
          onClick={() => setCurrentView('catalog')}
          className="px-5 py-2 text-xs font-semibold bg-sky-600 text-white rounded-lg"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const invoice = invoices.find(inv => inv.orderId === latestOrder.id) || {
    id: latestOrder.invoiceId,
    orderId: latestOrder.id,
    orderNumber: latestOrder.id,
    invoiceDate: latestOrder.createdAt,
    customerName: latestOrder.customerName,
    customerPhone: latestOrder.customerPhone,
    customerEmail: latestOrder.customerEmail,
    deliveryAddress: latestOrder.deliveryAddress,
    subtotal: latestOrder.subtotal,
    cgstAmount: Number((latestOrder.gstAmount / 2).toFixed(2)),
    sgstAmount: Number((latestOrder.gstAmount / 2).toFixed(2)),
    totalTax: latestOrder.gstAmount,
    deliveryCharge: latestOrder.deliveryCharge,
    discountAmount: latestOrder.discountAmount,
    finalAmount: latestOrder.totalAmount,
    paymentStatus: 'successful',
    paymentMethod: latestOrder.paymentMethod,
    transactionId: latestOrder.transactionId || 'TXN-98231',
    items: latestOrder.items
  };

  const waMessage = createWhatsAppMessage(latestOrder);
  const waUrl = generateWhatsAppDirectUrl(latestOrder.customerPhone, waMessage);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Success Badge Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-4 shadow-2xl relative overflow-hidden">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-mono text-emerald-400 font-semibold tracking-wide uppercase">
            Order Confirmed & Authorized
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Thank you, {latestOrder.customerName}!
          </h1>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Your electrical hardware purchase has been successfully placed under Order <span className="text-white font-mono font-bold">#{latestOrder.id}</span>.
          </p>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          {/* Download PDF Button */}
          <button
            onClick={() => downloadInvoicePdf(invoice)}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-sky-600 rounded-xl hover:bg-sky-500 transition-all shadow-md shadow-sky-950"
          >
            <Download className="w-4 h-4" />
            <span>Download Official PDF Invoice</span>
          </button>

          {/* WhatsApp Direct Dispatch Link */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-emerald-200 bg-emerald-950/70 border border-emerald-700/60 rounded-xl hover:bg-emerald-900/60 transition-all shadow-md"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>Open & Send on WhatsApp</span>
          </a>
        </div>
      </div>

      {/* WhatsApp & SMS Delivery Status Card */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Send className="w-3.5 h-3.5 text-sky-400" />
          <span>Automated Delivery Dispatch Log</span>
        </h3>

        <div className="space-y-2 text-xs">
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <div>
                <span className="font-semibold text-white">WhatsApp Cloud Dispatch:</span>
                <span className="text-slate-400 ml-1.5">{latestOrder.customerPhone}</span>
              </div>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
              Delivered / Link Ready
            </span>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <div>
                <span className="font-semibold text-white">SMS Order Confirmation:</span>
                <span className="text-slate-400 ml-1.5">{latestOrder.customerPhone}</span>
              </div>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
              Sent via Telecom Gateway
            </span>
          </div>
        </div>

        {/* Preview of WhatsApp Notification Template */}
        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] text-slate-400 font-mono whitespace-pre-line leading-relaxed">
          {waMessage}
        </div>
      </div>

      {/* Order Item Details */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400">
          <span>Order Summary</span>
          <span className="font-mono">Invoice #{latestOrder.invoiceId}</span>
        </div>

        <div className="divide-y divide-slate-800/80 text-xs">
          {latestOrder.items.map((item, idx) => (
            <div key={idx} className="py-3 flex justify-between gap-4">
              <div>
                <div className="font-semibold text-white">{item.productName}</div>
                <div className="text-slate-500 font-mono text-[11px]">
                  Qty: {item.quantity} · {item.voltageStr} · {item.warrantyMonths}M Warranty
                </div>
              </div>
              <div className="font-mono font-bold text-white text-right">
                ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-slate-800 space-y-1.5 text-xs text-slate-300">
          <div className="flex justify-between">
            <span className="text-slate-400">Subtotal</span>
            <span className="font-mono text-white">₹{latestOrder.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Total GST (18%)</span>
            <span className="font-mono text-white">₹{latestOrder.gstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Delivery Charges</span>
            <span className="font-mono text-white">
              {latestOrder.deliveryCharge === 0 ? <span className="text-emerald-400">FREE</span> : `₹${latestOrder.deliveryCharge.toFixed(2)}`}
            </span>
          </div>
          {latestOrder.discountAmount > 0 && (
            <div className="flex justify-between text-emerald-400">
              <span>Discount</span>
              <span className="font-mono">- ₹{latestOrder.discountAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          )}
          <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
            <span className="text-sm font-bold text-white">Total Amount Paid</span>
            <span className="text-xl font-bold font-mono text-white">
              ₹{latestOrder.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Nav Actions */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setCurrentView('my-orders')}
          className="text-xs font-semibold text-slate-300 hover:text-white"
        >
          View My Orders History →
        </button>
        <button
          onClick={() => setCurrentView('catalog')}
          className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
        >
          Continue Shopping
        </button>
      </div>

    </div>
  );
};
