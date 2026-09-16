import React, { useState } from 'react';
import { ProductSelector } from './ProductSelector';
import { OptionSelector } from './OptionSelector';
import { PanelSelector } from './PanelSelector';
import { SpecSummary } from './SpecSummary';
import { EditorToolbar } from '@/features/editor2d/components/EditorToolbar';
import { ElementInspector } from '@/features/editor2d/components/ElementInspector';
import { Layers, Palette, Sparkles, ClipboardList, ChevronRight, ChevronLeft } from 'lucide-react';

type TabType = 'model' | 'materials' | 'branding' | 'summary';

export const Sidebar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('branding');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const tabs: { id: TabType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'branding', label: '2D Branding', icon: Sparkles },
    { id: 'model', label: 'Model Size', icon: Layers },
    { id: 'materials', label: 'Finish & Color', icon: Palette },
    { id: 'summary', label: 'Spec Sheet', icon: ClipboardList },
  ];

  return (
    <aside
      className={`relative flex flex-col bg-slate-900 border-t md:border-t-0 md:border-l border-slate-800 transition-all duration-300 z-10 shrink-0 ${
        isCollapsed
          ? 'h-12 md:h-full w-full md:w-12'
          : 'w-full md:w-80 lg:w-96 h-80 md:h-full'
      }`}
    >
      {/* Collapse/Expand Toggle Button (Desktop) */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        className="hidden md:flex absolute -left-3.5 top-6 z-20 h-7 w-7 rounded-full bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 items-center justify-center shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
        title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
      >
        {isCollapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>

      {isCollapsed ? (
        /* Collapsed Icon Bar */
        <div className="flex flex-row md:flex-col items-center justify-around md:justify-start gap-2 md:gap-4 px-4 py-2 md:py-6 text-slate-400">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsCollapsed(false);
                }}
                aria-label={tab.label}
                className={`p-2 rounded-lg transition-all ${
                  isActive ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-white'
                }`}
                title={tab.label}
              >
                <Icon className="h-5 w-5" />
              </button>
            );
          })}
        </div>
      ) : (
        /* Full Sidebar Content */
        <div className="flex flex-col h-full overflow-hidden">
          {/* Studio Navigation Tabs */}
          <div className="flex items-center border-b border-slate-800 bg-slate-950/40 px-2 pt-2 gap-1 select-none overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  aria-label={tab.label}
                  className={`flex items-center gap-1.5 px-3 py-2.5 rounded-t-lg text-xs font-semibold transition-all border-t border-x whitespace-nowrap focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                    isActive
                      ? 'bg-slate-900 text-blue-400 border-slate-800 border-b-slate-900 -mb-px'
                      : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Tab Panel Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5 min-h-0">
            {activeTab === 'branding' && (
              <div className="space-y-5">
                <PanelSelector />
                <EditorToolbar />
                <ElementInspector />
              </div>
            )}
            {activeTab === 'model' && <ProductSelector />}
            {activeTab === 'materials' && <OptionSelector />}
            {activeTab === 'summary' && <SpecSummary />}
          </div>

          {/* Bottom Sidebar Action Footer */}
          <div className="p-3 md:p-4 border-t border-slate-800/80 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400 select-none shrink-0">
            <span className="text-[11px] font-medium text-slate-400">Canopy Studio 2D/3D</span>
            <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              State Synced
            </span>
          </div>
        </div>
      )}
    </aside>
  );
};

