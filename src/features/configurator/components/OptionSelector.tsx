import React from 'react';
import { useConfiguratorStore } from '@/core/state/useConfiguratorStore';
import { Check } from 'lucide-react';

export const OptionSelector: React.FC = () => {
  const activeProduct = useConfiguratorStore((s) => s.getActiveProduct());
  const activeColor = useConfiguratorStore((s) => s.getActiveCanopyColor());
  const activeFinish = useConfiguratorStore((s) => s.getActiveFrameFinish());
  const setCanopyColor = useConfiguratorStore((s) => s.setCanopyColor);
  const setFrameFinish = useConfiguratorStore((s) => s.setFrameFinish);

  return (
    <div className="space-y-6">
      {/* Fabric Canopy Color Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Canopy Fabric Color
          </label>
          <span className="text-xs font-medium text-white">{activeColor.name}</span>
        </div>

        <div className="grid grid-cols-6 gap-2">
          {activeProduct.availableCanopyColors.map((color) => {
            const isSelected = activeColor.id === color.id;

            return (
              <button
                key={color.id}
                onClick={() => setCanopyColor(color.id)}
                title={color.name}
                className={`group relative h-10 w-full rounded-lg transition-all flex items-center justify-center ${
                  isSelected
                    ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-900 scale-105 shadow-md'
                    : 'hover:scale-105 opacity-85 hover:opacity-100'
                }`}
                style={{ backgroundColor: color.colorHex }}
              >
                {isSelected && (
                  <Check
                    className={`h-4 w-4 ${
                      color.colorHex === '#ffffff' ? 'text-slate-900' : 'text-white'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Frame Metal Finish Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Frame Finish
          </label>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {activeProduct.availableFrameFinishes.map((finish) => {
            const isSelected = activeFinish.id === finish.id;

            return (
              <button
                key={finish.id}
                onClick={() => setFrameFinish(finish.id)}
                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-blue-600/10 border-blue-500 text-white'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900 hover:border-slate-700'
                }`}
              >
                <div
                  className="h-6 w-6 rounded-full border border-slate-600 shadow-inner shrink-0"
                  style={{ backgroundColor: finish.colorHex }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-white">{finish.name}</div>
                  <div className="text-[11px] text-slate-400 truncate">{finish.description}</div>
                </div>
                {isSelected && <Check className="h-4 w-4 text-blue-500 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
