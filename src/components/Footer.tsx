import React from 'react';
import { Zap, ShieldCheck, Truck, Headphones, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 text-sm">
      {/* Proof / Value proposition strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-slate-900/60">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Electrical Safety Verified</h4>
              <p className="text-xs text-slate-500 mt-0.5">Strict BIS & CE standards with BMS short-circuit protection.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Rapid Dispatch</h4>
              <p className="text-xs text-slate-500 mt-0.5">Free regional courier on orders above ₹3,000 or instant shop pickup.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Direct Warranty</h4>
              <p className="text-xs text-slate-500 mt-0.5">24 to 60 months official replacement & cell capacity coverage.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Engineer Sizing Support</h4>
              <p className="text-xs text-slate-500 mt-0.5">Direct WhatsApp sizing consultation with certified electrical staff.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                <Zap className="w-4 h-4 fill-sky-400/20" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white font-sans">
                Smart<span className="text-sky-400">Volt</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mb-4">
              SmartVolt is an industrial battery and power systems engineering company. We manufacture and distribute high-grade LiFePO4 cells, smart inverters, and precision electrical test equipment.
            </p>
            <div className="text-xs text-slate-500 font-mono">
              GSTIN: 27AABCS1429B1Z8 · HSN Chapter 8507
            </div>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">Products</h5>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => setCurrentView('catalog')} className="hover:text-sky-400 transition-colors">Lithium LiFePO4 Batteries</button></li>
              <li><button onClick={() => setCurrentView('catalog')} className="hover:text-sky-400 transition-colors">Solar Hybrid Inverters</button></li>
              <li><button onClick={() => setCurrentView('catalog')} className="hover:text-sky-400 transition-colors">DC Regulated Power Supplies</button></li>
              <li><button onClick={() => setCurrentView('catalog')} className="hover:text-sky-400 transition-colors">MPPT Charge Controllers</button></li>
              <li><button onClick={() => setCurrentView('catalog')} className="hover:text-sky-400 transition-colors">BLDC Heavy Motors</button></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">Smart Tools</h5>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => setCurrentView('smart-finder')} className="hover:text-sky-400 transition-colors">AI Electrical Matcher</button></li>
              <li><button onClick={() => setCurrentView('budget-calc')} className="hover:text-sky-400 transition-colors">Budget Sizing Calculator</button></li>
              <li><button onClick={() => setCurrentView('comparison')} className="hover:text-sky-400 transition-colors">4-Product Comparison</button></li>
              <li><button onClick={() => setCurrentView('my-invoices')} className="hover:text-sky-400 transition-colors">Tax Invoice Portal</button></li>
              <li><button onClick={() => setCurrentView('admin')} className="hover:text-sky-400 transition-colors">Admin Dashboard</button></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">Support & Legal</h5>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => setCurrentView('about')} className="hover:text-sky-400 transition-colors">About Our Lab</button></li>
              <li><button onClick={() => setCurrentView('contact')} className="hover:text-sky-400 transition-colors">Technical Inquiries</button></li>
              <li><a href="#privacy" className="hover:text-sky-400 transition-colors">Warranty Policy</a></li>
              <li><a href="#terms" className="hover:text-sky-400 transition-colors">Terms of Supply</a></li>
              <li className="pt-2 text-slate-500 font-mono text-[11px]">+91 98200 12345<br/>support@smartvolt.in</li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 SmartVolt Energy Technologies Pvt Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Powered by SmartVolt Electrical OS</span>
            <span>·</span>
            <span>Automated Billing & WhatsApp Dispatch</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
