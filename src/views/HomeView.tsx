import React from 'react';
import { 
  Zap, Sparkles, Calculator, ArrowRight, 
  ShieldCheck, BatteryCharging, Sun, Cpu, Settings2, Eye 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { CategoryType } from '../types';
import { APP_IMAGES, HARDWARE_GALLERY } from '../assets/images';

export const HomeView: React.FC = () => {
  const { setCurrentView, products, setSelectedCategory } = useApp();

  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 4);

  const categories = [
    {
      title: 'Batteries' as CategoryType,
      desc: 'LiFePO4, Lithium-ion & Deep Cycle Lead-Acid',
      image: APP_IMAGES.batteryIndustrial,
      specs: '12V · 24V · 48V · 100Ah - 150Ah'
    },
    {
      title: 'Power Equipment' as CategoryType,
      desc: 'Pure Sine Wave Inverters & Bench Power Supplies',
      image: APP_IMAGES.powerEquipment,
      specs: '300W - 5000W Continuous Rating'
    },
    {
      title: 'Solar Products' as CategoryType,
      desc: 'Bifacial Mono-PERC Panels & MPPT Controllers',
      image: APP_IMAGES.solarPanel,
      specs: '550W Panels · 60A 150V MPPT'
    },
    {
      title: 'Electrical Accessories' as CategoryType,
      desc: 'Fast Chargers, Anderson Plugs & 2 AWG Cables',
      image: APP_IMAGES.andersonCables,
      specs: 'Heavy-Duty DC Breakers & Terminals'
    }
  ];

  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 lg:pt-14 lg:pb-20 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-sky-400 bg-sky-950/60 border border-sky-800/60 px-3 py-1 rounded-md">
                <Zap className="w-3.5 h-3.5 fill-sky-400" />
                <span>Next-Gen Energy Storage & Power Systems</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.15]">
                Smart Batteries & Electrical Equipment Built for Exact Specs
              </h1>

              <p className="text-base text-slate-300 max-w-2xl leading-relaxed">
                SmartVolt engineers and delivers high-performance LiFePO4 batteries, pure sine wave inverters, and lab-grade power equipment. Every order includes automated electrical compatibility checks and instant GST invoices.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setCurrentView('hardware-gallery')}
                  className="flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-500 transition-all shadow-md shadow-sky-950"
                >
                  <Eye className="w-4 h-4 text-sky-200" />
                  <span>View All Hardware Photos</span>
                </button>
                <button
                  onClick={() => setCurrentView('smart-finder')}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-slate-200 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 hover:text-white transition-all"
                >
                  <Sparkles className="w-4 h-4 text-sky-400" />
                  <span>Smart Matcher</span>
                </button>
                <button
                  onClick={() => setCurrentView('budget-calc')}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-slate-200 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 hover:text-white transition-all"
                >
                  <Calculator className="w-4 h-4 text-emerald-400" />
                  <span>Budget Calculator</span>
                </button>
              </div>

              {/* Quick Voltage Rail Jump */}
              <div className="pt-4 border-t border-slate-900/80 flex items-center gap-3 text-xs text-slate-400">
                <span className="font-mono text-slate-500">Target Voltage:</span>
                {[12, 24, 48, 230].map(volt => (
                  <button
                    key={volt}
                    onClick={() => {
                      setCurrentView('catalog');
                    }}
                    className="font-mono px-2.5 py-1 bg-slate-900 border border-slate-800 rounded hover:border-sky-500 hover:text-white transition-colors"
                  >
                    {volt}V Rail
                  </button>
                ))}
              </div>
            </div>

            {/* Right Hero Visual */}
            <div className="lg:col-span-5 relative">
              <div 
                onClick={() => setCurrentView('hardware-gallery')}
                className="group relative rounded-2xl overflow-hidden border border-slate-800/90 shadow-2xl bg-slate-950 aspect-[16/11] cursor-pointer"
              >
                <img 
                  src={APP_IMAGES.hero} 
                  alt="SmartVolt Industrial Energy Storage System"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[11px] font-mono text-sky-300 px-2.5 py-1 rounded flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-sky-400" />
                  <span>Inspect Hardware (8 Photos)</span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 p-3 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <div>
                      <div className="text-xs font-bold text-white">Continuous Load Ready</div>
                      <div className="text-[10px] text-slate-400 font-mono">48V 100Ah · LiFePO4 · 4.8 kWh</div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentView('hardware-gallery');
                    }}
                    className="px-2.5 py-1 text-[11px] font-medium bg-sky-500/20 text-sky-300 rounded border border-sky-500/40 hover:bg-sky-500/30 transition-colors"
                  >
                    View Gallery
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Interactive Product Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">Product Categories</h2>
            <p className="text-xs text-slate-400 mt-1">Select an electrical category to filter by chemistry, voltage and continuous power.</p>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setCurrentView('catalog');
            }}
            className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => {
                setSelectedCategory(cat.title);
                setCurrentView('catalog');
              }}
              className="group bg-slate-900/50 border border-slate-800/80 rounded-xl overflow-hidden hover:border-sky-500/50 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden">
                <img 
                  src={cat.image} 
                  alt={cat.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="text-[11px] font-mono text-sky-400">{cat.specs}</div>
                  <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors">{cat.title}</h3>
                </div>
              </div>
              <div className="p-3.5 flex items-center justify-between border-t border-slate-800/60 bg-slate-950/40">
                <p className="text-xs text-slate-400 line-clamp-1">{cat.desc}</p>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 transition-colors shrink-0 ml-2" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2.5 Hardware Photography & Visual Inspection Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-sky-400 bg-sky-950/60 border border-sky-800/60 px-2.5 py-0.5 rounded mb-2">
                <Eye className="w-3.5 h-3.5" />
                <span>Lab Visual Inspection</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white">Live Hardware Photo Gallery</h2>
              <p className="text-xs text-slate-400 mt-1">
                Real studio photography of our industrial cells, pure sine wave power equipment, bifacial solar panels, and connectors.
              </p>
            </div>
            <button
              onClick={() => setCurrentView('hardware-gallery')}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors self-start sm:self-auto shrink-0 shadow-md shadow-sky-950"
            >
              <span>Explore All 8 Hardware Photos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 4-item visual teaser strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {HARDWARE_GALLERY.slice(0, 4).map((item) => (
              <div
                key={item.id}
                onClick={() => setCurrentView('hardware-gallery')}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-950 border border-slate-800 cursor-pointer hover:border-sky-500 transition-all"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                <div className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-sm border border-slate-800 text-[10px] font-mono text-sky-400 px-2 py-0.5 rounded">
                  {item.voltage}
                </div>
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="text-[10px] font-mono text-slate-400 uppercase truncate">{item.category}</div>
                  <div className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors truncate">
                    {item.title}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Smart Tools Callout Bento */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-8 rounded-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white">AI-Assisted Smart Product Finder</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Enter your required Voltage, Continuous Wattage, Battery Capacity Ah, and target backup duration. Our electrical rule-based engine mathematically verifies safety before suggesting compatible products.
              </p>
            </div>
            <div className="pt-6">
              <button
                onClick={() => setCurrentView('smart-finder')}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-500 transition-colors"
              >
                <span>Launch Sizing Assistant</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-8 rounded-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Calculator className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white">Budget-Based Shopping Calculator</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Specify your fixed total budget (e.g. ₹5,000 or ₹50,000). The system computes Subtotal, 18% GST, delivery charges, and remaining balance. If selected items exceed budget, it suggests cheaper compatible alternatives.
              </p>
            </div>
            <div className="pt-6">
              <button
                onClick={() => setCurrentView('budget-calc')}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-500 transition-colors"
              >
                <span>Plan Your Budget</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Featured Industrial Electrical Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">Featured High-Performance Hardware</h2>
            <p className="text-xs text-slate-400 mt-1">Laboratory-calibrated cells, pure sine wave power equipment and accessories.</p>
          </div>
          <button
            onClick={() => setCurrentView('catalog')}
            className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1"
          >
            <span>All Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

    </div>
  );
};
