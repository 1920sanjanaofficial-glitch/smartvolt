import React, { useState } from 'react';
import { ShoppingBag, GitCompare, Zap, Check, Star } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { APP_IMAGES } from '../assets/images';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { setCurrentView, addToCart, addToComparison, comparisonList } = useApp();
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const isInComparison = comparisonList.some(p => p.id === product.id);
  const isOutOfStock = product.stockQuantity <= 0;

  const getFallbackImg = () => {
    switch (product.category) {
      case 'Batteries':
        return product.specifications.nominalVoltage === 12.8 ? APP_IMAGES.batteryMarine : APP_IMAGES.batteryIndustrial;
      case 'Power Equipment':
        return product.subcategory === 'Inverters' ? APP_IMAGES.solarInverter : APP_IMAGES.powerEquipment;
      case 'Solar Products':
        return product.subcategory === 'Solar panels' ? APP_IMAGES.solarPanel : APP_IMAGES.solarInverter;
      case 'Electrical Accessories':
        return APP_IMAGES.andersonCables;
      default:
        return product.name.includes('Motor') ? APP_IMAGES.bldcMotor : APP_IMAGES.powerEquipment;
    }
  };

  const currentDisplayImage = !imgError && product.imageUrl ? product.imageUrl : getFallbackImg();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const res = addToCart(product, 1);
    if (res.success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 1600);
    }
  };

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isInComparison) {
      addToComparison(product);
    }
  };

  return (
    <div 
      onClick={() => setCurrentView('product-detail', product)}
      className="group bg-slate-900/60 border border-slate-800/80 rounded-xl overflow-hidden hover:border-sky-500/40 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      {/* Visual Slot */}
      <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden flex items-center justify-center">
        <img 
          src={currentDisplayImage} 
          alt={product.name}
          onError={() => setImgError(true)}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
        />

        {/* Quiet top meta indicator (No garish pills) */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 text-[11px] font-mono text-slate-200 bg-slate-950/70 backdrop-blur-sm px-2 py-0.5 rounded border border-slate-800/80">
          <span>{product.specifications.nominalVoltage}V</span>
          <span className="text-slate-500">·</span>
          <span>{product.specifications.continuousPowerWatts}W</span>
        </div>

        {/* Stock status indicator */}
        <div className="absolute top-2.5 right-2.5">
          {isOutOfStock ? (
            <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 bg-rose-950/80 px-1.5 py-0.5 rounded border border-rose-800/50">
              Out of Stock
            </span>
          ) : product.stockQuantity <= 5 ? (
            <span className="text-[10px] font-mono text-amber-300 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-800/50">
              Only {product.stockQuantity} left
            </span>
          ) : (
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/50">
              In Stock ({product.stockQuantity})
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Subtle Category & Rating line */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="truncate">{product.subcategory || product.category}</span>
            <div className="flex items-center gap-1 text-amber-400 shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="text-xs font-mono text-slate-200">{product.averageRating}</span>
              <span className="text-[11px] text-slate-500">({product.reviews.length})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="text-sm font-semibold text-slate-100 group-hover:text-sky-300 transition-colors line-clamp-2 leading-snug mb-2">
            {product.name}
          </h3>

          {/* Electrical specs bullet summary */}
          <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-x-2 gap-y-1 mb-3">
            {product.specifications.capacityAh && product.specifications.capacityAh > 0 && (
              <>
                <span className="text-slate-300 font-medium">{product.specifications.capacityAh} Ah</span>
                <span className="text-slate-600">·</span>
              </>
            )}
            {product.specifications.batteryChemistry && product.specifications.batteryChemistry !== 'N/A' && (
              <>
                <span className="text-slate-300">{product.specifications.batteryChemistry}</span>
                <span className="text-slate-600">·</span>
              </>
            )}
            <span>{product.specifications.connectorType}</span>
            <span className="text-slate-600">·</span>
            <span>{product.specifications.warrantyMonths}M Warranty</span>
          </div>
        </div>

        {/* Pricing & Actions */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <div>
            <div className="text-base font-bold text-white font-mono tabular-nums">
              ₹{product.price.toLocaleString('en-IN')}
            </div>
            {product.mrp > product.price && (
              <div className="text-[11px] text-slate-500 line-through font-mono">
                ₹{product.mrp.toLocaleString('en-IN')}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {/* Compare Button */}
            <button
              onClick={handleToggleCompare}
              title={isInComparison ? "In Comparison List" : "Add to Comparison"}
              className={`p-2 rounded-lg border text-xs transition-colors ${
                isInComparison 
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300' 
                  : 'bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:border-slate-600'
              }`}
            >
              <GitCompare className="w-3.5 h-3.5" />
            </button>

            {/* Quick Add Button */}
            <button
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isOutOfStock
                  ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'
                  : added
                  ? 'bg-emerald-600 text-white'
                  : 'bg-sky-600 hover:bg-sky-500 text-white shadow-sm'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
