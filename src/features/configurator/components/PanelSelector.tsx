import React from 'react';
import { useConfiguratorStore } from '@/core/state/useConfiguratorStore';
import { Check, Layers } from 'lucide-react';

export const PanelSelector: React.FC = () => {
  const activeProduct = useConfiguratorStore((s) => s.getActiveProduct());
  const selectedPanelId = useConfiguratorStore((s) => s.selectedPanelId);
  const setSelectedPanel = useConfiguratorStore((s) => s.setSelectedPanel);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Configurable Fabric Panels
        </label>
        <span className="text-[11px] text-slate-500">{activeProduct.panels.length} Sections</span>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {activeProduct.panels.map((panel) => {
          const isSelected = selectedPanelId === panel.id;

          return (
            <button
              key={panel.id}
              onClick={() => setSelectedPanel(panel.id)}
              className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-blue-600/10 border-blue-500 text-white'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="h-7 w-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300">
                  <Layers className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{panel.label}</div>
                  <div className="text-[11px] text-slate-400">{panel.description}</div>
                </div>
              </div>

              {isSelected && <Check className="h-4 w-4 text-blue-500 shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
