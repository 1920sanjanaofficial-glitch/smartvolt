import React, { useState } from 'react';
import { 
  Zap, Eye, ArrowRight, ShieldCheck, Filter, 
  Maximize2, X, Download, ShoppingBag, Sparkles, Check
} from 'lucide-react';
import { HARDWARE_GALLERY, GalleryItem } from '../assets/images';
import { useApp } from '../context/AppContext';

export const HardwareGalleryView: React.FC = () => {
  const { setCurrentView, products, addToCart } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [addedItem, setAddedItem] = useState<string | null>(null);

  const categories = ['All', 'Energy Storage Systems', 'Batteries', 'Power Equipment', 'Solar Products', 'Electrical Accessories', 'Other Electrical Equipment'];

  const filteredItems = selectedCategory === 'All' 
    ? HARDWARE_GALLERY 
    : HARDWARE_GALLERY.filter(item => item.category === selectedCategory);

  const handleQuickAdd = (item: GalleryItem) => {
    // Find matching product in catalog
    const matchingProd = products.find(p => 
      p.name.toLowerCase().includes(item.title.split(' ')[0].toLowerCase()) ||
      p.category === item.category
    );
    if (matchingProd) {
      addToCart(matchingProd, 1);
      setAddedItem(item.id);
      setTimeout(() => setAddedItem(null), 1800);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-10 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-sky-400 bg-sky-950/80 border border-sky-800 px-3 py-1 rounded-md">
            <Eye className="w-3.5 h-3.5 text-sky-400" />
            <span>High-Resolution Hardware Inspection Lab</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
            Industrial Energy & Electrical Equipment Gallery
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Examine our high-density LiFePO4 battery modules, pure sine wave hybrid inverters, bifacial solar modules, precision benchtop power supplies, and heavy-duty Anderson couplings in full studio resolution.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
        <Filter className="w-4 h-4 text-slate-500 shrink-0 ml-1 mr-2" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800/80'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Hardware Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-sky-500/50 hover:shadow-xl hover:shadow-sky-950/20 transition-all flex flex-col justify-between"
          >
            {/* Visual Box */}
            <div 
              onClick={() => {
                setActiveItem(item);
                setZoomLevel(1);
              }}
              className="relative aspect-[4/3] bg-slate-950 overflow-hidden cursor-zoom-in"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/10 to-transparent pointer-events-none" />

              {/* Badges */}
              <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[11px] font-mono text-sky-400 px-2.5 py-0.5 rounded-md">
                {item.voltage}
              </div>

              <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[11px] font-mono text-slate-300 px-2 py-0.5 rounded-md flex items-center gap-1 group-hover:border-sky-500 transition-colors">
                <Maximize2 className="w-3 h-3 text-sky-400" />
                <span>Inspect</span>
              </div>

              {/* Title overlay */}
              <div className="absolute bottom-3 left-3 right-3 pointer-events-none">
                <span className="text-[10px] uppercase font-mono tracking-wider text-sky-400">{item.category}</span>
                <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors line-clamp-1">
                  {item.title}
                </h3>
              </div>
            </div>

            {/* Details & Specs */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                  {item.description}
                </p>

                {/* Electrical Spec Badges */}
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                  <div>
                    <span className="text-slate-500 block text-[10px]">RATED VOLTAGE</span>
                    <span className="text-slate-200 font-semibold">{item.voltage}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">POWER CAPACITY</span>
                    <span className="text-slate-200 font-semibold">{item.wattage}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {item.tags.map((tag, i) => (
                    <span 
                      key={i} 
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/70 text-slate-300 border border-slate-700/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    setActiveItem(item);
                    setZoomLevel(1);
                  }}
                  className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-sky-300 font-medium py-1.5 px-2 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-sky-400" />
                  <span>Full View</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentView('catalog')}
                    className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 font-semibold py-1.5 px-2.5 rounded-lg bg-sky-950/60 border border-sky-800/60 hover:bg-sky-900/50 transition-colors"
                  >
                    <span>View in Catalog</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen High-Res Inspection Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-lg flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl my-auto flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-4 sm:px-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
              <div>
                <span className="text-[11px] font-mono text-sky-400 uppercase tracking-wider">{activeItem.category}</span>
                <h2 className="text-lg sm:text-xl font-bold text-white">{activeItem.title}</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoomLevel(prev => prev === 1 ? 1.6 : 1)}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-800 text-slate-300 border border-slate-700 hover:text-white transition-colors"
                >
                  {zoomLevel === 1 ? 'Zoom 1.6x' : 'Reset Zoom'}
                </button>
                <button
                  onClick={() => setActiveItem(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              {/* Image Viewport */}
              <div className="lg:col-span-8 bg-slate-950 rounded-xl overflow-hidden border border-slate-800/80 flex items-center justify-center relative min-h-[320px] max-h-[560px]">
                <div 
                  className="w-full h-full overflow-auto flex items-center justify-center"
                  style={{ cursor: zoomLevel > 1 ? 'grab' : 'zoom-in' }}
                  onClick={() => setZoomLevel(prev => prev === 1 ? 1.6 : 1)}
                >
                  <img
                    src={activeItem.imageUrl}
                    alt={activeItem.title}
                    referrerPolicy="no-referrer"
                    className="max-w-full max-h-[540px] object-contain transition-transform duration-300 rounded-lg"
                    style={{ transform: `scale(${zoomLevel})` }}
                  />
                </div>
                <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-sm text-[11px] font-mono text-slate-400 px-2.5 py-1 rounded border border-slate-800">
                  Click image to toggle zoom
                </div>
              </div>

              {/* Technical Specifications Sheet */}
              <div className="lg:col-span-4 space-y-4">
                <div className="space-y-1">
                  <h4 className="text-xs uppercase font-mono tracking-wider text-slate-400">Engineering Overview</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{activeItem.description}</p>
                </div>

                <div className="space-y-2 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/90 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Operating Voltage:</span>
                    <span className="font-mono text-sky-400 font-semibold">{activeItem.voltage}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Continuous Capacity:</span>
                    <span className="font-mono text-slate-200 font-semibold">{activeItem.wattage}</span>
                  </div>
                  {activeItem.chemistry && (
                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-400">Chemistry:</span>
                      <span className="font-mono text-emerald-400 font-semibold">{activeItem.chemistry}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Primary Connector:</span>
                    <span className="font-mono text-slate-200">Industrial Terminal</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => {
                      setActiveItem(null);
                      setCurrentView('catalog');
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white transition-all shadow-md shadow-sky-950"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Browse Compatible Products</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveItem(null);
                      setCurrentView('smart-finder');
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                    <span>Calculate System Sizing</span>
                  </button>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
