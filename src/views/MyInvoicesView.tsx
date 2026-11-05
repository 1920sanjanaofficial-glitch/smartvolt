import React, { useState } from 'react';
import { 
  FileText, Download, Printer, Search, 
  ShieldCheck, Eye, ArrowLeft, Check 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Invoice } from '../types';

export const MyInvoicesView: React.FC = () => {
  const { invoices, downloadInvoicePdf, setCurrentView } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [activePreviewInvoice, setActivePreviewInvoice] = useState<Invoice | null>(null);

  const filteredInvoices = invoices.filter(inv => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      inv.id.toLowerCase().includes(term) ||
      inv.orderNumber.toLowerCase().includes(term) ||
      inv.customerName.toLowerCase().includes(term)
    );
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Tax Invoice Registry</h1>
          <p className="text-xs text-slate-400 mt-1">
            Download authorized GST tax invoices compliant with Chapter 8507 and Indian taxation standards.
          </p>
        </div>
        <button
          onClick={() => setCurrentView('my-orders')}
          className="text-xs font-semibold text-slate-400 hover:text-white self-start sm:self-auto"
        >
          ← Back to Orders
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
        <input
          type="text"
          placeholder="Search by invoice number or order ID..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
        />
      </div>

      {filteredInvoices.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/40 border border-slate-800 rounded-2xl space-y-3">
          <FileText className="w-12 h-12 text-slate-600 mx-auto" />
          <p className="text-sm text-slate-300">No invoices match your search.</p>
        </div>
      ) : (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                <tr>
                  <th className="p-4">Invoice #</th>
                  <th className="p-4">Order Ref</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Tax (18% GST)</th>
                  <th className="p-4">Final Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredInvoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-sky-400 whitespace-nowrap">
                      {inv.id}
                    </td>
                    <td className="p-4 font-mono text-slate-300 whitespace-nowrap">
                      #{inv.orderNumber}
                    </td>
                    <td className="p-4 font-mono text-slate-400 whitespace-nowrap">
                      {inv.invoiceDate}
                    </td>
                    <td className="p-4 font-semibold text-white whitespace-nowrap">
                      {inv.customerName}
                    </td>
                    <td className="p-4 font-mono text-slate-300 whitespace-nowrap">
                      ₹{inv.totalTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4 font-mono font-bold text-emerald-400 whitespace-nowrap">
                      ₹{inv.finalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4">
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded uppercase">
                        Paid
                      </span>
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setActivePreviewInvoice(inv)}
                          title="Preview Invoice"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => downloadInvoicePdf(inv)}
                          title="Download PDF"
                          className="px-2.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs flex items-center gap-1 transition-colors shadow-sm"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>PDF</span>
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

      {/* Invoice Quick Preview Modal */}
      {activePreviewInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-sky-400" />
                <h3 className="font-bold text-white text-base">Invoice Preview: {activePreviewInvoice.id}</h3>
              </div>
              <button 
                onClick={() => setActivePreviewInvoice(null)}
                className="text-slate-400 hover:text-white text-xs font-semibold"
              >
                Close ✕
              </button>
            </div>

            {/* Document Header Representation */}
            <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-4 text-xs">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-white text-sm">SMARTVOLT ELECTRICALS & ENERGY</h4>
                  <p className="text-slate-400 text-[11px]">GSTIN: 27AABCS1429B1Z8 · HSN: 8507</p>
                  <p className="text-slate-500 text-[11px]">support@smartvolt.in · +91 98200 12345</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-sky-400 text-sm block">TAX INVOICE</span>
                  <span className="font-mono text-slate-300">Date: {activePreviewInvoice.invoiceDate}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-500 font-semibold uppercase text-[10px] block">Billed To</span>
                  <p className="font-semibold text-white">{activePreviewInvoice.customerName}</p>
                  <p className="text-slate-400 font-mono">{activePreviewInvoice.customerPhone}</p>
                  <p className="text-slate-500 line-clamp-1">{activePreviewInvoice.deliveryAddress}</p>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 font-semibold uppercase text-[10px] block">Payment Reference</span>
                  <p className="font-mono text-emerald-400 font-semibold">SUCCESSFUL ({activePreviewInvoice.paymentMethod.toUpperCase()})</p>
                  <p className="text-slate-400 font-mono text-[11px]">TXN: {activePreviewInvoice.transactionId}</p>
                </div>
              </div>

              {/* Items */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <span className="text-slate-500 font-semibold uppercase text-[10px] block">Itemized Equipment</span>
                {activePreviewInvoice.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between py-1 border-b border-slate-900 text-slate-300">
                    <div>
                      <span className="font-semibold text-white">{item.productName}</span>
                      <span className="text-[11px] text-slate-500 block font-mono">
                        Qty: {item.quantity} · {item.voltageStr} · {item.warrantyMonths}M Warranty
                      </span>
                    </div>
                    <span className="font-mono text-white">
                      ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="pt-2 space-y-1 text-right text-slate-300 font-mono">
                <div>Subtotal: ₹{activePreviewInvoice.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                <div>CGST (9%): ₹{activePreviewInvoice.cgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                <div>SGST (9%): ₹{activePreviewInvoice.sgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                <div>Delivery: ₹{activePreviewInvoice.deliveryCharge.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                {activePreviewInvoice.discountAmount > 0 && (
                  <div className="text-emerald-400">- ₹{activePreviewInvoice.discountAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                )}
                <div className="text-sm font-bold text-white pt-1 border-t border-slate-800">
                  Total Paid: ₹{activePreviewInvoice.finalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>
              <button
                onClick={() => downloadInvoicePdf(activePreviewInvoice)}
                className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-xs font-semibold text-white transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
