import React, { useState } from 'react';
import { 
  Sparkles, Zap, CheckCircle2, AlertTriangle, 
  Phone, ArrowRight, BatteryCharging, ShoppingBag, 
  HelpCircle, RotateCcw, Clock 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SmartRecommendationQuery } from '../types';
import { rankProductsWithML, calculateBackupHours } from '../utils/electricalEngine';

export const SmartFinderView: React.FC = () => {
  const { products, setCurrentView, addToCart } = useApp();

  const [voltage, setVoltage] = useState<number>(48);
  const [powerWatts, setPowerWatts] = useState<number>(1500);
  const [capacityAh, setCapacityAh] = useState<number>(100);
  const [chemistry, setChemistry] = useState<string>('LiFePO4');
  const [connector, setConnector] = useState<string>('M8');
  const [application, setApplication] = useState<string>('Solar Inverter & Home Backup');
  const [backupHours, setBackupHours] = useState<number>(3);
  const [budget, setBudget] = useState<number>(75000);

  const [hasEvaluated, setHasEvaluated] = useState<boolean>(true);

  // Compute recommendations
  const query: SmartRecommendationQuery = {
    requiredVoltage: Number(voltage) || 0,
    requiredPowerWatts: Number(powerWatts) || 0,
    batteryCapacityAh: Number(capacityAh) || 0,
    connectorType: connector,
    batteryChemistry: chemistry,
    applicationUsage: application,
    requiredBackupHours: Number(backupHours) || 0,
    budget: Number(budget) || 1000000
  };

  const rankedResults = rankProductsWithML(products, query);
  const compatibleMatches = rankedResults.filter(r => r.check.isCompatible);
  const incompatibleList = rankedResults.filter(r => !r.check.isCompatible);

  // Calculate theoretical capacity needed based on requested backup hours:
  // Wh = Load * Hours -> Ah = Wh / (V * DoD * Eff)
  const theoreticalAhNeeded = query.requiredVoltage > 0 && query.requiredPowerWatts > 0 && query.requiredBackupHours
    ? Math.round((query.requiredPowerWatts * query.requiredBackupHours) / (query.requiredVoltage * 0.85 * 0.90))
    : 0;

  const handleReset = () => {
    setVoltage(48);
    setPowerWatts(1500);
    setCapacityAh(100);
    setChemistry('LiFePO4');
    setConnector('M8');
    setApplication('Solar Inverter & Home Backup');
    setBackupHours(3);
    setBudget(75000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Title Bar */}
      <div className="pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs font-mono text-sky-400 mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Electrical Engineering & ML Compatibility Sizing</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Smart Product Matcher
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          Enter your electrical system parameters. Our deterministic rule engine validates nominal voltage, continuous power headroom, chemistry charge curves, and connector pinouts to guarantee 100% physical safety before ranking suitable hardware.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Interactive Input Panel */}
        <div className="lg:col-span-5 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-sky-400" />
              <span>System Requirements</span>
            </h2>
            <button
              onClick={handleReset}
              className="text-[11px] font-mono text-slate-400 hover:text-white flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          <div className="space-y-4 text-xs">
            
            {/* Voltage Rail */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="font-semibold text-slate-300">Required System Voltage (V)</label>
                <span className="font-mono text-sky-400 font-bold">{voltage} V</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[12, 24, 48, 230].map(v => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setVoltage(v)}
                    className={`py-1.5 rounded-lg border font-mono text-xs transition-colors ${
                      voltage === v 
                        ? 'bg-sky-600 border-sky-500 text-white font-bold' 
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {v}V
                  </button>
                ))}
              </div>
              <input
                type="range"
                min="12"
                max="250"
                step="2"
                value={voltage}
                onChange={e => setVoltage(Number(e.target.value))}
                className="w-full mt-2 accent-sky-500"
              />
            </div>

            {/* Continuous Load Power */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="font-semibold text-slate-300">Continuous Power Load (Watts)</label>
                <span className="font-mono text-sky-400 font-bold">{powerWatts} W</span>
              </div>
              <input
                type="number"
                min="50"
                max="20000"
                step="50"
                value={powerWatts}
                onChange={e => setPowerWatts(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:border-sky-500 focus:outline-none"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                Continuous wattage rating must meet or exceed this value.
              </span>
            </div>

            {/* Target Capacity & Runtime */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Battery Ah Capacity</label>
                <input
                  type="number"
                  min="0"
                  max="1000"
                  value={capacityAh}
                  onChange={e => setCapacityAh(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 font-mono focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Target Backup (Hours)</label>
                <input
                  type="number"
                  min="0.5"
                  max="48"
                  step="0.5"
                  value={backupHours}
                  onChange={e => setBackupHours(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 font-mono focus:border-sky-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Chemistry & Connector */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Cell Chemistry</label>
                <select
                  value={chemistry}
                  onChange={e => setChemistry(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:border-sky-500 focus:outline-none"
                >
                  <option value="LiFePO4">LiFePO4 (90% DoD)</option>
                  <option value="Li-ion">Li-ion (80% DoD)</option>
                  <option value="Lead-Acid">Lead-Acid Tubular</option>
                  <option value="VRLA">VRLA / AGM</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Connector Interface</label>
                <select
                  value={connector}
                  onChange={e => setConnector(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:border-sky-500 focus:outline-none"
                >
                  <option value="M8">M8 Bolt / Ring Lug</option>
                  <option value="Anderson">Anderson SB50 / Powerpole</option>
                  <option value="Terminal">Terminal Posts</option>
                  <option value="Screw">Screw Terminal Block</option>
                  <option value="MC4">MC4 Solar</option>
                </select>
              </div>
            </div>

            {/* Application Context */}
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Intended Usage / Application</label>
              <select
                value={application}
                onChange={e => setApplication(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:border-sky-500 focus:outline-none"
              >
                <option value="Solar Inverter & Home Backup">Solar Inverter & Home Power Backup</option>
                <option value="Electric Vehicle / Golf Cart">EV, AGV or Electric Golf Cart</option>
                <option value="Laboratory Test Bench">Electronics Lab & Precision Bench</option>
                <option value="Marine & RV Mobile Rig">Marine, Boat & RV Living</option>
                <option value="Computer Datacenter UPS">Server UPS & Network Rack</option>
              </select>
            </div>

            {/* Budget Limit */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="font-semibold text-slate-300">Customer Budget Limit</label>
                <span className="font-mono text-emerald-400 font-bold">₹{budget.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="2000"
                max="150000"
                step="1000"
                value={budget}
                onChange={e => setBudget(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            {/* Theoretical Sizing Tip Box */}
            {theoreticalAhNeeded > 0 && (
              <div className="p-3 bg-sky-950/40 border border-sky-800/60 rounded-xl space-y-1 text-slate-300">
                <div className="flex items-center gap-1.5 text-sky-400 font-semibold text-[11px]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Calculated Battery Capacity Goal:</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  To sustain <span className="text-white font-mono">{powerWatts}W</span> for <span className="text-white font-mono">{backupHours} hours</span> at {voltage}V, you need approximately <span className="text-emerald-400 font-mono font-bold">~{theoreticalAhNeeded} Ah</span> usable storage.
                </p>
              </div>
            )}

          </div>
        </div>

        {/* Right: Recommendation Results */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white">
                Compatible Electrical Recommendations
              </h2>
              <span className="text-xs text-slate-400 font-mono">
                {compatibleMatches.length} verified compatible product(s) found
              </span>
            </div>
            <div className="text-xs font-mono text-slate-400">
              Safety Gate: <span className="text-emerald-400 font-bold">Active</span>
            </div>
          </div>

          {/* If no compatible product found */}
          {compatibleMatches.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">No Direct Off-the-Shelf Match</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                  No single product in our catalog simultaneously meets your {voltage}V voltage, {powerWatts}W continuous load, and {chemistry} chemistry requirement with available inventory.
                </p>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 text-left text-xs space-y-2 max-w-md mx-auto">
                <span className="font-semibold text-slate-200">Recommended Next Steps:</span>
                <p className="text-slate-400">
                  1. Contact SmartVolt custom engineering team for custom modular series-parallel battery packing.
                </p>
                <p className="text-slate-400">
                  2. Adjust voltage rail (e.g. standard 48V or 24V instead of non-standard voltages).
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setCurrentView('contact')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-500 transition-colors shadow-sm"
                >
                  <Phone className="w-4 h-4" />
                  <span>Contact Custom Engineering Shop</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {compatibleMatches.map(({ product, check, explanation }, idx) => (
                <div 
                  key={product.id}
                  className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-sky-500/50 transition-all flex flex-col md:flex-row gap-5 items-start justify-between"
                >
                  <div className="flex gap-4">
                    {/* Thumbnail */}
                    <div 
                      onClick={() => setCurrentView('product-detail', product)}
                      className="w-24 h-24 rounded-lg bg-slate-950 overflow-hidden border border-slate-800 shrink-0 cursor-pointer"
                    >
                      <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover" 
                      />
                    </div>

                    {/* Content */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-1.5 py-0.5 rounded">
                          {check.compatibilityScore}% Compatibility Match
                        </span>
                        <span className="text-xs text-slate-500 font-mono">
                          SKU: {product.sku}
                        </span>
                      </div>

                      <h3 
                        onClick={() => setCurrentView('product-detail', product)}
                        className="text-sm font-bold text-white hover:text-sky-300 transition-colors cursor-pointer"
                      >
                        {product.name}
                      </h3>

                      <div className="text-xs text-slate-300 flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="font-mono text-sky-400 font-semibold">{product.specifications.nominalVoltage}V</span>
                        <span>·</span>
                        <span className="font-mono font-semibold">{product.specifications.continuousPowerWatts}W</span>
                        {product.specifications.capacityAh && product.specifications.capacityAh > 0 && (
                          <>
                            <span>·</span>
                            <span className="font-mono text-emerald-400">{product.specifications.capacityAh}Ah</span>
                          </>
                        )}
                        <span>·</span>
                        <span>{product.specifications.connectorType}</span>
                      </div>

                      {/* Engineering reasoning explanation */}
                      <p className="text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60 leading-relaxed">
                        <span className="text-sky-400 font-medium">Why Recommended: </span>
                        {explanation}
                      </p>
                    </div>
                  </div>

                  {/* Pricing & CTA */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800 gap-3">
                    <div>
                      <div className="text-base font-bold text-white font-mono">
                        ₹{product.price.toLocaleString('en-IN')}
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">Excl. 18% GST</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentView('product-detail', product)}
                        className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => addToCart(product, 1)}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Incompatible Products Explanation (Education/Transparency) */}
          {incompatibleList.length > 0 && (
            <div className="pt-6 border-t border-slate-800 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Incompatible Hardware (Safety Filtered)
              </h3>
              <p className="text-xs text-slate-500">
                The following products were filtered out because they violate electrical safety rules, lack required wattage headroom, or have incompatible voltage rails.
              </p>

              <div className="space-y-2">
                {incompatibleList.slice(0, 3).map(({ product, check }) => (
                  <div key={product.id} className="p-3 bg-slate-950 border border-slate-900 rounded-lg flex items-center justify-between text-xs text-slate-400">
                    <span className="font-medium text-slate-300 truncate max-w-xs">{product.name}</span>
                    <span className="text-[11px] text-rose-400 font-mono">{check.notes[0] || 'Technical constraint violation'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
