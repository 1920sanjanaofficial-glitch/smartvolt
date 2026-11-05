import React, { useState, useMemo } from 'react';
import { 
  Filter, Search, SlidersHorizontal, 
  RotateCcw, Sparkles 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { CategoryType } from '../types';

export const CatalogView: React.FC = () => {
  const { 
    products, selectedCategory, setSelectedCategory, 
    searchQuery, setSearchQuery, setCurrentView 
  } = useApp();

  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('All');
  const [selectedVoltage, setSelectedVoltage] = useState<number | 'All'>('All');
  const [selectedChemistry, setSelectedChemistry] = useState<string>('All');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'power'>('featured');
  const [maxPrice, setMaxPrice] = useState<number>(100000);

  const categoriesList: (CategoryType | 'All')[] = [
    'All',
    'Batteries',
    'Power Equipment',
    'Solar Products',
    'Electrical Accessories',
    'Other Electrical Equipment'
  ];

  // Derive subcategories for active category
  const subcategories = useMemo(() => {
    if (selectedCategory === 'All') return [];
    const subs = new Set<string>();
    products
      .filter(p => p.category === selectedCategory)
      .forEach(p => {
        if (p.subcategory) subs.add(p.subcategory);
      });
    return Array.from(subs);
  }, [products, selectedCategory]);

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Category filter
      if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
      // Subcategory filter
      if (selectedSubcategory !== 'All' && p.subcategory !== selectedSubcategory) return false;
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchSku = p.sku.toLowerCase().includes(q);
        const matchDesc = p.description.toLowerCase().includes(q);
        const matchChem = p.specifications.batteryChemistry?.toLowerCase().includes(q);
        const matchV = `${p.specifications.nominalVoltage}v`.includes(q);
        if (!matchName && !matchSku && !matchDesc && !matchChem && !matchV) return false;
      }
      // Voltage filter
      if (selectedVoltage !== 'All' && p.specifications.nominalVoltage !== selectedVoltage) return false;
      // Chemistry filter
      if (selectedChemistry !== 'All' && p.specifications.batteryChemistry !== selectedChemistry) return false;
      // Stock filter
      if (inStockOnly && p.stockQuantity <= 0) return false;
      // Price ceiling
      if (p.price > maxPrice) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.averageRating - a.averageRating;
      if (sortBy === 'power') return b.specifications.continuousPowerWatts - a.specifications.continuousPowerWatts;
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [products, selectedCategory, selectedSubcategory, searchQuery, selectedVoltage, selectedChemistry, inStockOnly, maxPrice, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedSubcategory('All');
    setSelectedVoltage('All');
    setSelectedChemistry('All');
    setInStockOnly(false);
    setMaxPrice(100000);
    setSearchQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Banner / Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Electrical Hardware Catalog</h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse verified industrial batteries, regulated DC power equipment, solar gear and electrical accessories.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('smart-finder')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-500/10 border border-sky-500/30 text-sky-400 hover:bg-sky-500/20 rounded-lg text-xs font-medium transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Need Compatibility Sizing?</span>
          </button>
        </div>
      </div>

      {/* Main Categories Segmented Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-none">
        {categoriesList.map(cat => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setSelectedSubcategory('All');
            }}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors shrink-0 ${
              selectedCategory === cat
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Subcategories (if selected) */}
      {subcategories.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-500 font-mono text-[11px] mr-1">Subcategory:</span>
          <button
            onClick={() => setSelectedSubcategory('All')}
            className={`px-2.5 py-1 rounded text-xs transition-colors ${
              selectedSubcategory === 'All' 
                ? 'bg-slate-800 text-white font-medium' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Subcategories
          </button>
          {subcategories.map(sub => (
            <button
              key={sub}
              onClick={() => setSelectedSubcategory(sub)}
              className={`px-2.5 py-1 rounded text-xs transition-colors whitespace-nowrap ${
                selectedSubcategory === sub 
                  ? 'bg-slate-800 text-sky-400 font-medium' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4">
        
        {/* Left: Search & Voltage */}
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by keyword or SKU..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Voltage Select */}
          <select
            value={selectedVoltage}
            onChange={e => setSelectedVoltage(e.target.value === 'All' ? 'All' : Number(e.target.value))}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-sky-500"
          >
            <option value="All">All Voltages</option>
            <option value="12">12V / 12.8V Rail</option>
            <option value="24">24V Rail</option>
            <option value="48">48V Rail</option>
            <option value="72">72V Rail</option>
            <option value="230">230V AC Mains</option>
          </select>

          {/* Chemistry Select */}
          <select
            value={selectedChemistry}
            onChange={e => setSelectedChemistry(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-sky-500"
          >
            <option value="All">All Chemistries</option>
            <option value="LiFePO4">LiFePO4</option>
            <option value="Li-ion">Li-ion NMC</option>
            <option value="Lead-Acid">Lead-Acid Tubular</option>
            <option value="VRLA">VRLA / AGM</option>
          </select>
        </div>

        {/* Right: Stock toggle, Sort & Reset */}
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={e => setInStockOnly(e.target.checked)}
              className="rounded bg-slate-950 border-slate-800 text-sky-500 focus:ring-0"
            />
            <span>In Stock Only</span>
          </label>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-sky-500"
          >
            <option value="featured">Featured First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Customer Rating</option>
            <option value="power">Continuous Power (Watts)</option>
          </select>

          <button
            onClick={handleResetFilters}
            title="Reset Filters"
            className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Active Count & Items */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-mono">
        <span>Showing {filteredProducts.length} electrical products</span>
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="text-sky-400 hover:underline">
            Clear "{searchQuery}"
          </button>
        )}
      </div>

      {/* Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <p className="text-base text-slate-300 font-medium">No products match your active filters.</p>
          <p className="text-xs text-slate-500">Try adjusting your voltage selection, chemistry, or search terms.</p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 text-xs font-semibold text-sky-400 bg-sky-950/60 border border-sky-800/60 rounded-lg hover:bg-sky-900/40 transition-colors inline-block"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
};
