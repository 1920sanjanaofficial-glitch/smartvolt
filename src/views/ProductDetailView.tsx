import React, { useState } from 'react';
import { 
  ShoppingBag, GitCompare, Zap, ShieldCheck, 
  Truck, ArrowLeft, Star, Check, Award, MessageSquarePlus, Maximize2, Eye, X 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { ReviewModal } from '../components/ReviewModal';
import { findCheaperCompatibleAlternatives } from '../utils/electricalEngine';

export const ProductDetailView: React.FC = () => {
  const { 
    selectedProduct, setCurrentView, addToCart, 
    addToComparison, comparisonList, products 
  } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  if (!selectedProduct) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-slate-400">No product selected.</p>
        <button
          onClick={() => setCurrentView('catalog')}
          className="px-4 py-2 text-xs font-semibold bg-sky-600 text-white rounded-lg"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const specs = selectedProduct.specifications;
  const isInComparison = comparisonList.some(p => p.id === selectedProduct.id);
  const isOutOfStock = selectedProduct.stockQuantity <= 0;

  // Find compatible alternatives
  const compatibleAlternatives = findCheaperCompatibleAlternatives(selectedProduct, products).slice(0, 3);

  const handleAddToCart = () => {
    setErrorMsg('');
    const res = addToCart(selectedProduct, quantity);
    if (res.success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 1800);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleToggleCompare = () => {
    if (!isInComparison) {
      addToComparison(selectedProduct);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Back button */}
      <button
        onClick={() => setCurrentView('catalog')}
        className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-sky-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Catalog</span>
      </button>

      {/* Main PDP Grid: Gallery Left, Sticky Purchase Module Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Image & Deep Specifications Sheet */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Main Visual Box */}
          <div 
            onClick={() => setIsZoomOpen(true)}
            className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center cursor-zoom-in hover:border-sky-500/50 transition-all"
          >
            {selectedProduct.imageUrl ? (
              <img 
                src={selectedProduct.imageUrl} 
                alt={selectedProduct.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
              />
            ) : (
              <Zap className="w-16 h-16 text-sky-500/40" />
            )}
            <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-sm border border-slate-800 text-xs font-mono text-sky-400 px-3 py-1 rounded-md">
              SKU: {selectedProduct.sku}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomOpen(true);
              }}
              className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-sm border border-slate-800 text-xs font-mono text-slate-300 hover:text-white px-2.5 py-1 rounded-md flex items-center gap-1.5 hover:border-sky-400 transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5 text-sky-400" />
              <span>Inspect Photo</span>
            </button>
          </div>

          {/* Detailed Electrical Spec Table */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-sky-400" />
              <span>Technical & Electrical Specifications</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Nominal System Voltage</span>
                <span className="font-mono font-semibold text-white">{specs.nominalVoltage} V DC</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Continuous Power Rating</span>
                <span className="font-mono font-semibold text-white">{specs.continuousPowerWatts} W</span>
              </div>
              {specs.surgePowerWatts && (
                <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">Surge / Peak Power</span>
                  <span className="font-mono text-slate-200">{specs.surgePowerWatts} W</span>
                </div>
              )}
              {specs.capacityAh && specs.capacityAh > 0 && (
                <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">Battery Capacity</span>
                  <span className="font-mono font-semibold text-emerald-400">{specs.capacityAh} Ah ({((specs.nominalVoltage * specs.capacityAh) / 1000).toFixed(2)} kWh)</span>
                </div>
              )}
              {specs.batteryChemistry && specs.batteryChemistry !== 'N/A' && (
                <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">Cell Chemistry</span>
                  <span className="font-medium text-white">{specs.batteryChemistry}</span>
                </div>
              )}
              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Connector Interface</span>
                <span className="font-medium text-slate-200">{specs.connectorType}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Electrical Efficiency</span>
                <span className="font-mono text-slate-200">{specs.efficiencyPercent}%</span>
              </div>
              {specs.cycleLife && (
                <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">Cycle Durability</span>
                  <span className="font-mono text-slate-200">{specs.cycleLife}+ Cycles</span>
                </div>
              )}
              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Warranty Term</span>
                <span className="font-mono font-semibold text-amber-300">{specs.warrantyMonths} Months Official</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">HSN Classification Code</span>
                <span className="font-mono text-slate-400">{specs.hsnCode}</span>
              </div>
              {specs.weightKg && (
                <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">Net Weight</span>
                  <span className="font-mono text-slate-200">{specs.weightKg} kg</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-white">Engineering Overview</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedProduct.description}
            </p>
          </div>

        </div>

        {/* Right Column: Contiguous Purchase Module */}
        <div className="lg:col-span-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 sticky top-24">
            
            {/* Category & Title */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>{selectedProduct.category} · {selectedProduct.subcategory}</span>
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="font-bold text-slate-200 font-mono">{selectedProduct.averageRating}</span>
                  <span className="text-slate-500">({selectedProduct.reviews.length} reviews)</span>
                </div>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                {selectedProduct.name}
              </h1>
            </div>

            {/* Pricing Area */}
            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-400 block mb-0.5">Price (Excl. 18% GST at checkout)</span>
                <div className="text-3xl font-bold text-white font-mono tabular-nums">
                  ₹{selectedProduct.price.toLocaleString('en-IN')}
                </div>
              </div>
              {selectedProduct.mrp > selectedProduct.price && (
                <div className="text-right">
                  <span className="text-xs text-emerald-400 font-mono block">
                    Save ₹{(selectedProduct.mrp - selectedProduct.price).toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm text-slate-500 line-through font-mono">
                    ₹{selectedProduct.mrp.toLocaleString('en-IN')}
                  </span>
                </div>
              )}
            </div>

            {/* Stock Availability */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Inventory Status:</span>
              {isOutOfStock ? (
                <span className="text-rose-400 font-mono font-semibold">Out of Stock</span>
              ) : (
                <span className="text-emerald-400 font-mono font-semibold">
                  In Stock ({selectedProduct.stockQuantity} units available)
                </span>
              )}
            </div>

            {/* Quantity Stepper */}
            {!isOutOfStock && (
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <span className="text-xs text-slate-300">Quantity</span>
                <div className="flex items-center border border-slate-700 rounded-lg bg-slate-950 overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 text-xs font-mono font-bold text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(selectedProduct.stockQuantity, quantity + 1))}
                    className="px-3 py-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {errorMsg && (
              <p className="text-xs text-rose-400 bg-rose-950/40 border border-rose-900 p-2 rounded">
                {errorMsg}
              </p>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <button
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className={`w-full py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                  isOutOfStock
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : added
                    ? 'bg-emerald-600 text-white'
                    : 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-950'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added {quantity} to Shopping Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleCompare}
                  className={`flex-1 py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                    isInComparison
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <GitCompare className="w-3.5 h-3.5" />
                  <span>{isInComparison ? 'In Comparison List' : 'Compare Product'}</span>
                </button>
                <button
                  onClick={() => setCurrentView('smart-finder')}
                  className="py-2 px-3 rounded-lg border border-slate-800 bg-slate-950 text-sky-400 hover:border-sky-500/40 text-xs font-medium flex items-center gap-1"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Check Sizing</span>
                </button>
              </div>
            </div>

            {/* Trust Assurances */}
            <div className="pt-4 border-t border-slate-800 space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>GST Tax Invoice automatically generated & WhatsApped</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{specs.warrantyMonths} Months official manufacturer warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Free courier delivery over ₹3,000 or pick up at center</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Customer Reviews Section */}
      <section className="pt-8 border-t border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Verified Customer Ratings & Reviews</h2>
            <p className="text-xs text-slate-400 mt-1">Real electrical feedback from certified buyers and engineers.</p>
          </div>
          <button
            onClick={() => setReviewModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-sky-500 text-xs text-slate-200 hover:text-white rounded-lg transition-colors"
          >
            <MessageSquarePlus className="w-3.5 h-3.5 text-sky-400" />
            <span>Write Review</span>
          </button>
        </div>

        {selectedProduct.reviews.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-8 text-center text-xs text-slate-400">
            No reviews yet for this product. Be the first customer to share your test experience!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedProduct.reviews.map(rev => (
              <div key={rev.id} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-white">{rev.userName}</span>
                    {rev.isVerifiedPurchase && (
                      <span className="text-[10px] text-emerald-400 font-mono">· Verified Buyer</span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">{rev.createdAt}</span>
                </div>
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400' : 'text-slate-700'}`} 
                    />
                  ))}
                  <span className="text-xs font-semibold text-slate-200 ml-1">{rev.title}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Compatible Alternatives (Prompt requirement: "Display compatible alternatives; never suggest an incompatible product simply because it is cheaper") */}
      {compatibleAlternatives.length > 0 && (
        <section className="pt-8 border-t border-slate-800 space-y-4">
          <div>
            <h2 className="text-lg font-bold text-white">Cheaper Compatible Alternatives</h2>
            <p className="text-xs text-slate-400 mt-1">
              Electrically verified alternatives matching the {specs.nominalVoltage}V operating rail and continuous power demands at lower price points.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {compatibleAlternatives.map(alt => (
              <ProductCard key={alt.id} product={alt} />
            ))}
          </div>
        </section>
      )}

      {/* Review Modal */}
      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        productId={selectedProduct.id}
        productName={selectedProduct.name}
      />

      {/* Photo Inspection Modal */}
      {isZoomOpen && selectedProduct.imageUrl && (
        <div 
          onClick={() => setIsZoomOpen(false)}
          className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-2xl"
          >
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-sky-400 bg-sky-950/80 px-2.5 py-0.5 rounded border border-sky-800">
                  {selectedProduct.sku}
                </span>
                <span className="text-sm font-semibold text-white truncate max-w-md">{selectedProduct.name}</span>
              </div>
              <button 
                onClick={() => setIsZoomOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-slate-950 min-h-[350px]">
              <img 
                src={selectedProduct.imageUrl} 
                alt={selectedProduct.name} 
                className="max-w-full max-h-[75vh] object-contain rounded-lg"
              />
            </div>
            <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>{specs.nominalVoltage}V · {specs.continuousPowerWatts}W</span>
              <span>Click outside or press X to close</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
