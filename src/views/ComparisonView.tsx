import React from 'react';
import { 
  GitCompare, Trash2, Plus, ShoppingBag, 
  Check, X, Star, Zap, ShieldCheck 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';

export const ComparisonView: React.FC = () => {
  const { comparisonList, removeFromComparison, clearComparison, addToCart, setCurrentView, products } = useApp();

  const fields = [
    { label: 'Category', render: (p: Product) => p.category },
    { label: 'System Voltage', render: (p: Product) => `${p.specifications.nominalVoltage} V`, highlight: true },
    { label: 'Continuous Power', render: (p: Product) => `${p.specifications.continuousPowerWatts} W`, highlight: true },
    { label: 'Peak / Surge Power', render: (p: Product) => p.specifications.surgePowerWatts ? `${p.specifications.surgePowerWatts} W` : 'N/A' },
    { label: 'Battery Capacity (Ah)', render: (p: Product) => p.specifications.capacityAh ? `${p.specifications.capacityAh} Ah` : 'N/A', highlight: true },
    { label: 'Chemistry / Battery Type', render: (p: Product) => p.specifications.batteryChemistry || 'Standard Hardware' },
    { label: 'Connector Interface', render: (p: Product) => p.specifications.connectorType },
    { label: 'Electrical Efficiency', render: (p: Product) => `${p.specifications.efficiencyPercent}%` },
    { label: 'Warranty Period', render: (p: Product) => `${p.specifications.warrantyMonths} Months`, highlight: true },
    { label: 'Stock Availability', render: (p: Product) => p.stockQuantity > 0 ? (
      <span className="text-emerald-400 font-mono font-medium">In Stock ({p.stockQuantity})</span>
    ) : (
      <span className="text-rose-400 font-mono font-medium">Out of Stock</span>
    )},
    { label: 'Customer Rating', render: (p: Product) => (
      <div className="flex items-center gap-1 text-amber-400">
        <Star className="w-3.5 h-3.5 fill-amber-400" />
        <span className="font-mono font-bold text-slate-100">{p.averageRating}</span>
        <span className="text-slate-500 text-[11px]">({p.reviews.length})</span>
      </div>
    )},
    { label: 'Price (Excl. Tax)', render: (p: Product) => (
      <span className="font-mono font-bold text-white text-base">₹{p.price.toLocaleString('en-IN')}</span>
    ), highlight: true }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title & Clear */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
            <GitCompare className="w-3.5 h-3.5" />
            <span>Side-by-Side Electrical Spec Evaluation (Max 4 Products)</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Product Comparison Matrix
          </h1>
        </div>

        {comparisonList.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={clearComparison}
              className="px-3 py-1.5 text-xs text-rose-400 hover:text-white hover:bg-rose-950/40 rounded-lg border border-rose-900/40 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Matrix</span>
            </button>
            <button
              onClick={() => setCurrentView('catalog')}
              className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add More Products</span>
            </button>
          </div>
        )}
      </div>

      {comparisonList.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <GitCompare className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">No Products Selected for Comparison</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Browse our electrical catalog and click the compare icon on up to 4 products to evaluate differences in voltage, continuous power, capacity and warranty.
          </p>
          <button
            onClick={() => setCurrentView('catalog')}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-500 transition-colors"
          >
            Explore Catalog
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Comparison Table */}
          <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-900/60 shadow-xl">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/80">
                  <th className="p-4 w-44 font-bold text-slate-400 uppercase tracking-wider text-[11px] sticky left-0 bg-slate-950 z-10 border-r border-slate-800">
                    Product Specification
                  </th>
                  {comparisonList.map(product => (
                    <th key={product.id} className="p-4 min-w-[220px] max-w-[260px] align-top">
                      <div className="space-y-3">
                        <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-slate-950 border border-slate-800">
                          <img 
                            src={product.imageUrl} 
                            alt={product.name} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover" 
                          />
                          <button
                            onClick={() => removeFromComparison(product.id)}
                            title="Remove"
                            className="absolute top-2 right-2 p-1 rounded bg-black/70 hover:bg-rose-600 text-white transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div>
                          <span className="text-[10px] font-mono text-slate-500 block">{product.sku}</span>
                          <h4 
                            onClick={() => setCurrentView('product-detail', product)}
                            className="text-xs font-bold text-white hover:text-sky-300 transition-colors cursor-pointer line-clamp-2"
                          >
                            {product.name}
                          </h4>
                        </div>

                        <button
                          disabled={product.stockQuantity <= 0}
                          onClick={() => addToCart(product, 1)}
                          className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 disabled:bg-slate-800 disabled:text-slate-500 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </th>
                  ))}
                  {/* Fill empty slots up to 4 */}
                  {[...Array(Math.max(0, 4 - comparisonList.length))].map((_, idx) => (
                    <th key={idx} className="p-4 min-w-[200px] border-l border-slate-800/40 text-center align-middle bg-slate-950/20">
                      <button
                        onClick={() => setCurrentView('catalog')}
                        className="p-6 rounded-xl border border-dashed border-slate-800 hover:border-sky-500 text-slate-500 hover:text-sky-400 flex flex-col items-center gap-2 mx-auto transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                        <span className="text-[11px] font-medium">Add Product ({comparisonList.length + idx + 1}/4)</span>
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {fields.map((field, fIdx) => (
                  <tr key={fIdx} className={`hover:bg-slate-800/30 transition-colors ${field.highlight ? 'bg-slate-900/40' : ''}`}>
                    <td className="p-4 font-semibold text-slate-300 sticky left-0 bg-slate-950 z-10 border-r border-slate-800 text-xs">
                      {field.label}
                    </td>
                    {comparisonList.map(product => (
                      <td key={product.id} className="p-4 text-slate-200">
                        {field.render(product)}
                      </td>
                    ))}
                    {[...Array(Math.max(0, 4 - comparisonList.length))].map((_, idx) => (
                      <td key={idx} className="p-4 border-l border-slate-800/40 text-slate-600 text-center">
                        —
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Technical Analysis Summary */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-sky-400" />
              <span>Electrical Sizing Verdict</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              When pairing components, never connect batteries with mismatched nominal voltages in parallel. Always confirm your inverter's DC input rail matches your battery bank voltage ({comparisonList.map(p => `${p.specifications.nominalVoltage}V`).join(', ')}).
            </p>
          </div>

        </div>
      )}

    </div>
  );
};
