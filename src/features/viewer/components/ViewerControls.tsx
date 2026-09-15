import React from 'react';
import { useConfiguratorStore } from '@/core/state/useConfiguratorStore';
import { RotateCw, Grid as GridIcon, Compass, Eye, Maximize } from 'lucide-react';
import { CameraPreset } from '@/core/state/types';

interface ViewerControlsProps {
  onResetCamera: () => void;
}

export const ViewerControls: React.FC<ViewerControlsProps> = ({ onResetCamera }) => {
  const autoRotate = useConfiguratorStore((s) => s.autoRotate);
  const showGrid = useConfiguratorStore((s) => s.showGrid);
  const cameraPreset = useConfiguratorStore((s) => s.cameraPreset);
  const setAutoRotate = useConfiguratorStore((s) => s.setAutoRotate);
  const setShowGrid = useConfiguratorStore((s) => s.setShowGrid);
  const setCameraPreset = useConfiguratorStore((s) => s.setCameraPreset);
  const activeProduct = useConfiguratorStore((s) => s.getActiveProduct());

  const presets: { id: CameraPreset; label: string }[] = [
    { id: 'default', label: '3D View' },
    { id: 'front', label: 'Front' },
    { id: 'side', label: 'Side' },
    { id: 'top', label: 'Top View' },
  ];

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-10">
      {/* Product Spec Badge */}
      <div className="pointer-events-auto flex items-center gap-2.5 rounded-xl bg-slate-900/90 px-3.5 py-2 border border-slate-700/80 backdrop-blur-md text-xs font-medium text-slate-200 shadow-xl">
        <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-white font-semibold">{activeProduct.name}</span>
        <span className="text-slate-500">•</span>
        <span className="text-slate-300">{activeProduct.dimensions.footprintAreaSqFt} sq ft</span>
      </div>

      {/* Floating Toolbar Controls */}
      <div className="pointer-events-auto flex flex-wrap items-center gap-1.5 rounded-xl bg-slate-900/90 p-1.5 border border-slate-700/80 backdrop-blur-md shadow-2xl text-slate-200">
        {/* Camera Preset Selector */}
        <div className="flex flex-wrap items-center bg-slate-950/70 rounded-lg p-1 mr-1 border border-slate-800 gap-0.5">
          <Eye className="h-3.5 w-3.5 text-slate-400 ml-1.5 mr-1 shrink-0" />
          {presets.map((p) => (
            <button
              key={p.id}
              onClick={() => setCameraPreset(p.id)}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                cameraPreset === p.id
                  ? 'bg-blue-600 text-white shadow-sm font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Auto Rotate Toggle */}
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          title={autoRotate ? 'Pause Orbit Rotation' : 'Start Auto Rotation'}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
            autoRotate
              ? 'bg-blue-600/25 text-blue-400 border border-blue-500/40'
              : 'hover:bg-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <RotateCw className={`h-3.5 w-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Rotate</span>
        </button>

        {/* Grid Toggle */}
        <button
          onClick={() => setShowGrid(!showGrid)}
          title={showGrid ? 'Hide Floor Grid' : 'Show Floor Grid'}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
            showGrid
              ? 'bg-slate-800 text-white border border-slate-600'
              : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <GridIcon className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Grid</span>
        </button>

        {/* Reset Camera */}
        <button
          onClick={onResetCamera}
          title="Reset Camera Angle"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium hover:bg-slate-800 text-slate-300 hover:text-white transition-all"
        >
          <Compass className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          title="Toggle Fullscreen Viewport"
          className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium hover:bg-slate-800 text-slate-300 hover:text-white transition-all"
        >
          <Maximize className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
