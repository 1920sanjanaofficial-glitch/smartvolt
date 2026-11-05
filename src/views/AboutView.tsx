import React from 'react';
import { 
  Zap, Award, ShieldCheck, Cpu, BatteryCharging, 
  FlaskConical, CheckCircle2, ArrowRight 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AboutView: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Hero Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-sky-400 bg-sky-950/60 border border-sky-800/60 px-3 py-1 rounded-md">
          <FlaskConical className="w-3.5 h-3.5 text-sky-400" />
          <span>Industrial Power & Energy Testing Facility</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Precision Electrical Engineering & Advanced Battery Systems
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          SmartVolt was founded by power electronics and electrochemical engineers dedicated to solving the gap between theoretical battery ratings and real-world industrial reliability. We test, calibrate and guarantee every lithium cell, pure sine wave inverter, and DC power system we dispatch.
        </p>
      </div>

      {/* Lab Highlights Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <BatteryCharging className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Electrochemical Cell Grading</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every incoming lithium iron phosphate (LiFePO4) prismatic cell undergoes 100% capacity verification using high-precision automated battery cyclers, ensuring internal resistance (IR) delta within &lt;0.05mΩ.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Smart Active BMS Architecture</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Our battery packs feature industrial solid-state Battery Management Systems with active cell balancing, dual thermal probes, and microsecond short-circuit interruption.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Certified Safety Compliance</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Certified to BIS IS 16046 (IEC 62133) for secondary lithium cells, CE-EMC for electromagnetic interference, and RoHS hazardous substances directives.
          </p>
        </div>

      </div>

      {/* Physical Testing Bench Section */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-2xl font-bold text-white">
            0% Tolerance for Electrical Incompatibility
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Unlike generic marketplaces where customers frequently buy inverters that overload battery packs or chargers with wrong voltage profiles, SmartVolt embeds deterministic electrical gatekeeping right into the software.
          </p>
          <div className="space-y-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Exact nominal voltage matching with strict ±8% safe operating windows.</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Continuous power wattage checked against peak inductive motor loads.</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Automated GST billing with verified HSN 8507 classification.</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
          <img 
            src="/src/assets/images/cat_power_equipment_1793862946892.jpg" 
            alt="SmartVolt Testing Laboratory" 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover" 
          />
        </div>
      </div>

    </div>
  );
};
