import React from 'react';
import { useConfiguratorStore } from '@/core/state/useConfiguratorStore';
import { Minus, Plus, ShieldCheck, Cpu } from 'lucide-react';

export const SpecSummary: React.FC = () => {
  const activeProduct = useConfiguratorStore((s) => s.getActiveProduct());
  const activeColor = useConfiguratorStore((s) => s.getActiveCanopyColor());
  const activeFinish = useConfiguratorStore((s) => s.getActiveFrameFinish());
  const quantity = useConfiguratorStore((s) => s.quantity);
  const setQuantity = useConfiguratorStore((s) => s.setQuantity);

  return (
    <div className="space-y-4">
      {/* Product Spec Table */}
      <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-4 space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">
          Configuration Summary
        </h4>

        <div className="space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Product Model</span>
            <span className="font-semibold text-white">{activeProduct.name}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Dimensions</span>
            <span className="font-medium text-slate-200">
              {activeProduct.dimensions.widthFeet}' x {activeProduct.dimensions.depthFeet}'
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Footprint Area</span>
            <span className="font-medium text-slate-200">
              {activeProduct.dimensions.footprintAreaSqFt} sq ft
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Frame Finish</span>
            <span className="font-medium text-slate-200">{activeFinish.name}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Canopy Color</span>
            <div className="flex items-center gap-1.5">
              <span
                className="h-3 w-3 rounded-full border border-slate-600 shadow-sm"
                style={{ backgroundColor: activeColor.colorHex }}
              />
              <span className="font-medium text-slate-200">{activeColor.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quantity Selector */}
      <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-4 flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-white block">Order Quantity</span>
          <span className="text-[11px] text-slate-400">Production units</span>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 rounded-lg p-1 border border-slate-800">
          <button
            onClick={() => setQuantity(quantity - 1)}
            disabled={quantity <= 1}
            className="h-7 w-7 rounded flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 hover:bg-slate-800 transition-all"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="w-8 text-center text-xs font-bold text-white">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="h-7 w-7 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* API Pricing Service Notice Pill */}
      <div className="rounded-xl bg-blue-950/40 border border-blue-900/50 p-3 flex items-start gap-2.5 text-xs text-blue-300">
        <Cpu className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-blue-200 block">Dynamic Pricing Integration</span>
          <span className="text-[11px] text-blue-300/80">
            Real-time pricing service interface contract active.
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 pt-1">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
        <span>Configuration State Synchronized</span>
      </div>
    </div>
  );
};
