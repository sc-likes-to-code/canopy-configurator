import React, { useState } from 'react';
import { Header } from '@/features/configurator/components/Header';
import { CanvasViewer } from '@/features/viewer/components/CanvasViewer';
import { PanelEditor2D } from '@/features/editor2d/components/PanelEditor2D';
import { Sidebar } from '@/features/configurator/components/Sidebar';
import { LayoutGrid, Box, Edit3 } from 'lucide-react';

type ViewMode = 'split' | '3d' | '2d';

export const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('split');

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 font-sans text-slate-100">
      {/* Top Application Header */}
      <Header />

      {/* Main Studio Workspace */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Central Workspace: 2D Artboard + 3D Viewport */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Workspace Mode Switcher Floating Bar */}
          <div className="absolute top-3 left-3 z-20 flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-700/80 backdrop-blur-md shadow-xl text-xs select-none">
            <button
              onClick={() => setViewMode('split')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-all ${
                viewMode === 'split' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Split 2D + 3D</span>
            </button>
            <button
              onClick={() => setViewMode('3d')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-all ${
                viewMode === '3d' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Box className="h-3.5 w-3.5" />
              <span>3D View</span>
            </button>
            <button
              onClick={() => setViewMode('2d')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-all ${
                viewMode === '2d' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>2D Canvas</span>
            </button>
          </div>

          {/* Canvas Workspaces Render */}
          <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden">
            {/* 2D Design Artboard Editor */}
            {(viewMode === 'split' || viewMode === '2d') && (
              <div
                className={`relative bg-slate-900/40 border-r border-slate-800/80 flex flex-col items-center justify-center p-2 overflow-hidden ${
                  viewMode === 'split' ? 'w-full lg:w-1/2 h-1/2 lg:h-full' : 'w-full h-full'
                }`}
              >
                <PanelEditor2D />
              </div>
            )}

            {/* 3D R3F Viewport */}
            {(viewMode === 'split' || viewMode === '3d') && (
              <div
                className={`relative overflow-hidden ${
                  viewMode === 'split' ? 'w-full lg:w-1/2 h-1/2 lg:h-full' : 'w-full h-full'
                }`}
              >
                <CanvasViewer />
              </div>
            )}
          </div>
        </div>

        {/* Configurator Controls Sidebar */}
        <Sidebar />
      </main>
    </div>
  );
};

export default App;
