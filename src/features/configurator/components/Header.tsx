import React from 'react';
import { useConfiguratorStore } from '@/core/state/useConfiguratorStore';
import { Box, RotateCcw, Share2, Layers } from 'lucide-react';

export const Header: React.FC = () => {
  const activeProduct = useConfiguratorStore((s) => s.getActiveProduct());
  const resetConfiguration = useConfiguratorStore((s) => s.resetConfiguration);

  return (
    <header className="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between z-20 shrink-0 select-none">
      {/* Brand & Logo */}
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
          <Box className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold tracking-tight text-white uppercase">Canopy Studio</h1>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Interactive 3D
            </span>
          </div>
          <p className="text-[11px] text-slate-400 hidden sm:block">Commercial Canopy Tent Configurator</p>
        </div>
      </div>

      {/* Active Model Summary pill */}
      <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/80 border border-slate-800 text-xs">
        <Layers className="h-3.5 w-3.5 text-blue-400" />
        <span className="text-slate-400">Selected Model:</span>
        <span className="text-white font-semibold">{activeProduct.name}</span>
      </div>

      {/* Top Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={resetConfiguration}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all border border-transparent hover:border-slate-700"
          title="Reset configuration to defaults"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>

        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: 'Canopy Studio Configurator', url: window.location.href }).catch(() => {});
            }
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-sm font-semibold"
        >
          <Share2 className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Share Spec</span>
        </button>
      </div>
    </header>
  );
};
