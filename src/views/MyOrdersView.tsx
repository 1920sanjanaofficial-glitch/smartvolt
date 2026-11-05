import React, { useState } from 'react';
import { 
  Package, Download, MessageSquare, Star, 
  ExternalLink, ArrowRight, ShieldCheck, Clock 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ReviewModal } from '../components/ReviewModal';
import { createWhatsAppMessage, generateWhatsAppDirectUrl } from '../utils/notifications';

export const MyOrdersView: React.FC = () => {
  const { orders, invoices, downloadInvoicePdf, setCurrentView } = useApp();

  const [reviewTarget, setReviewTarget] = useState<{ id: string; name: string } | null>(null);

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
          <Package className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">No Orders Placed Yet</h2>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          You haven't purchased any electrical hardware yet. Check our catalog or use the smart finder.
        </p>
        <button
          onClick={() => setCurrentView('catalog')}
          className="px-6 py-2.5 text-xs font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-500 transition-colors"
        >
          Explore Electrical Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title */}
      <div className="pb-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Order History & Invoices</h1>
          <p className="text-xs text-slate-400 mt-1">
            Track past shipments, download GST tax receipts, and write verified reviews.
          </p>
        </div>
        <button
          onClick={() => setCurrentView('my-invoices')}
          className="text-xs font-semibold text-sky-400 hover:text-sky-300"
        >
          View All Invoices →
        </button>
      </div>

      <div className="space-y-6">
        {orders.map(order => {
          const inv = invoices.find(i => i.orderId === order.id);
          const waUrl = generateWhatsAppDirectUrl(order.customerPhone, createWhatsAppMessage(order));

          return (
            <div key={order.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              
              {/* Order Header Strip */}
              <div className="p-4 sm:p-5 bg-slate-950/80 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-slate-500 block">Order Number</span>
                    <span className="font-bold text-white font-mono text-sm">#{order.id}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-slate-500 block">Date Placed</span>
                    <span className="text-slate-300 font-mono">{order.createdAt}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-slate-500 block">Total Amount</span>
                    <span className="font-bold text-emerald-400 font-mono">
                      ₹{order.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded">
                    {order.orderStatus}
                  </span>
                  <span className="text-[10px] font-mono uppercase text-sky-400 bg-sky-950/60 border border-sky-800/50 px-2 py-0.5 rounded">
                    Paid ({order.paymentMethod.toUpperCase()})
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-5 divide-y divide-slate-800/60 text-xs">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden shrink-0">
                        <img 
                          src={item.imageUrl} 
                          alt={item.productName} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-white line-clamp-1">{item.productName}</h4>
                        <p className="text-[11px] text-slate-400 font-mono">
                          Qty: {item.quantity} · {item.voltageStr} · {item.warrantyMonths}M Warranty
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <div className="font-mono font-bold text-white text-right">
                        ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                      </div>
                      <button
                        onClick={() => setReviewTarget({ id: item.productId, name: item.productName })}
                        className="px-2.5 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-md border border-slate-700 transition-colors flex items-center gap-1"
                      >
                        <Star className="w-3 h-3 fill-amber-300" />
                        <span>Review</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Footer & Actions */}
              <div className="p-4 bg-slate-950/50 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="text-slate-400 text-[11px]">
                  Fulfillment: <span className="text-white">{order.deliveryMethod === 'shop_pickup' ? 'Shop Pickup' : order.deliveryAddress}</span>
                </div>

                <div className="flex items-center gap-2">
                  {inv && (
                    <button
                      onClick={() => downloadInvoicePdf(inv)}
                      className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF Invoice</span>
                    </button>
                  )}
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 hover:bg-emerald-900/60 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp Copy</span>
                  </a>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {reviewTarget && (
        <ReviewModal
          isOpen={true}
          onClose={() => setReviewTarget(null)}
          productId={reviewTarget.id}
          productName={reviewTarget.name}
        />
      )}

    </div>
  );
};
