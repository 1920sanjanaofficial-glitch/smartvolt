import React, { useState } from 'react';
import { 
  Zap, ShoppingBag, Sparkles, Calculator, 
  GitCompare, User, Shield, Menu, X, Search, Eye 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const { 
    currentView, setCurrentView, cart, comparisonList, 
    isAdmin, setIsAdmin, searchQuery, setSearchQuery 
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleNavClick = (view: string) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-16">
          
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2 group text-left focus:outline-none"
            >
              <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 group-hover:bg-sky-500/20 group-hover:border-sky-400 transition-all">
                <Zap className="w-5 h-5 fill-sky-400/20" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-white whitespace-nowrap font-sans">
                  Smart<span className="text-sky-400">Volt</span>
                </span>
              </div>
            </button>
          </div>

          {/* Quick Search Bar (Desktop) */}
          <div className="hidden lg:flex items-center flex-1 max-w-xs relative">
            <Search className="w-4 h-4 absolute left-3 text-slate-400" />
            <input 
              type="text"
              placeholder="Search 48V, LiFePO4, Inverters..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (currentView !== 'catalog') setCurrentView('catalog');
              }}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
            />
          </div>

          {/* Zone 2: Navigation Links (single-line, clean unboxed text) */}
          <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-300">
            <button 
              onClick={() => handleNavClick('hardware-gallery')}
              className={`flex items-center gap-1.5 hover:text-white transition-colors whitespace-nowrap ${currentView === 'hardware-gallery' ? 'text-sky-400 font-semibold' : ''}`}
            >
              <Eye className="w-3.5 h-3.5 text-sky-400" />
              <span>Hardware Gallery</span>
              <span className="text-[10px] font-mono bg-sky-500/20 text-sky-300 border border-sky-500/30 px-1.5 py-0.2 rounded">
                8 Photos
              </span>
            </button>
            <button 
              onClick={() => handleNavClick('catalog')}
              className={`hover:text-white transition-colors whitespace-nowrap ${currentView === 'catalog' ? 'text-sky-400 font-semibold' : ''}`}
            >
              Catalog
            </button>
            <button 
              onClick={() => handleNavClick('smart-finder')}
              className={`flex items-center gap-1.5 hover:text-white transition-colors whitespace-nowrap ${currentView === 'smart-finder' ? 'text-sky-400 font-semibold' : ''}`}
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              Smart Match
            </button>
            <button 
              onClick={() => handleNavClick('budget-calc')}
              className={`flex items-center gap-1.5 hover:text-white transition-colors whitespace-nowrap ${currentView === 'budget-calc' ? 'text-sky-400 font-semibold' : ''}`}
            >
              <Calculator className="w-3.5 h-3.5 text-emerald-400" />
              Budget Planner
            </button>
            <button 
              onClick={() => handleNavClick('comparison')}
              className={`flex items-center gap-1 hover:text-white transition-colors whitespace-nowrap ${currentView === 'comparison' ? 'text-sky-400 font-semibold' : ''}`}
            >
              <GitCompare className="w-3.5 h-3.5 text-amber-400" />
              Compare
              {comparisonList.length > 0 && (
                <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded-full">
                  {comparisonList.length}
                </span>
              )}
            </button>
            <button 
              onClick={() => handleNavClick('about')}
              className={`hover:text-white transition-colors whitespace-nowrap ${currentView === 'about' ? 'text-sky-400 font-semibold' : ''}`}
            >
              Engineering
            </button>
          </nav>

          {/* Zone 3: Actions & Cart */}
          <div className="flex items-center gap-3 shrink-0">
            
            {/* Admin Toggle button */}
            <button
              onClick={() => {
                setIsAdmin(!isAdmin);
                if (!isAdmin) setCurrentView('admin');
              }}
              title={isAdmin ? "Switch to Customer View" : "Open Admin Console"}
              className={`px-2.5 py-1.5 text-xs font-mono rounded-md border flex items-center gap-1.5 transition-all ${
                isAdmin 
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-400' 
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isAdmin ? 'Admin Mode' : 'Admin'}</span>
            </button>

            {/* Profile Dropdown / Nav */}
            <button
              onClick={() => handleNavClick('profile')}
              title="Customer Account"
              className={`p-2 rounded-lg border transition-colors ${
                currentView === 'profile' 
                  ? 'bg-sky-500/10 border-sky-500/30 text-sky-400' 
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <User className="w-4 h-4" />
            </button>

            {/* Primary Action: Shopping Cart Button */}
            <button 
              onClick={() => handleNavClick('cart')}
              className="relative flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-500 transition-all shadow-sm shadow-sky-950 whitespace-nowrap shrink-0"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {totalCartCount > 0 && (
                <span className="font-mono text-xs bg-white text-slate-950 font-bold px-1.5 py-0.5 rounded-full">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800/80 py-3 space-y-2">
            <div className="px-2 pb-2">
              <input 
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (currentView !== 'catalog') setCurrentView('catalog');
                }}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>
            <button 
              onClick={() => handleNavClick('hardware-gallery')} 
              className="block w-full text-left px-3 py-2 text-sm text-sky-400 font-semibold hover:bg-slate-900 rounded-md flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-sky-400" />
                Hardware Gallery
              </span>
              <span className="text-[10px] font-mono bg-sky-500/20 text-sky-300 border border-sky-500/30 px-1.5 py-0.5 rounded">
                8 Photos
              </span>
            </button>
            <button 
              onClick={() => handleNavClick('catalog')} 
              className="block w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-900 rounded-md"
            >
              Browse Catalog
            </button>
            <button 
              onClick={() => handleNavClick('smart-finder')} 
              className="block w-full text-left px-3 py-2 text-sm text-sky-400 hover:bg-slate-900 rounded-md"
            >
              Smart Product Finder
            </button>
            <button 
              onClick={() => handleNavClick('budget-calc')} 
              className="block w-full text-left px-3 py-2 text-sm text-emerald-400 hover:bg-slate-900 rounded-md"
            >
              Budget Sizing Calculator
            </button>
            <button 
              onClick={() => handleNavClick('comparison')} 
              className="block w-full text-left px-3 py-2 text-sm text-amber-400 hover:bg-slate-900 rounded-md"
            >
              Product Comparison ({comparisonList.length})
            </button>
            <button 
              onClick={() => handleNavClick('my-orders')} 
              className="block w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-900 rounded-md"
            >
              My Orders & Invoices
            </button>
            <button 
              onClick={() => handleNavClick('about')} 
              className="block w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-900 rounded-md"
            >
              About & Lab Facilities
            </button>
            <button 
              onClick={() => handleNavClick('contact')} 
              className="block w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-900 rounded-md"
            >
              Contact Support
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
