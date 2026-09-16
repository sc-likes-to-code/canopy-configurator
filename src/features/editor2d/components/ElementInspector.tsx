import React from 'react';
import { useConfiguratorStore } from '@/core/state/useConfiguratorStore';
import { AlignLeft, AlignCenter, AlignRight, Bold, RotateCw } from 'lucide-react';

export const ElementInspector: React.FC = () => {
  const activePanel = useConfiguratorStore((s) => s.getActivePanel());
  const activePanelDesign = useConfiguratorStore((s) => s.getActivePanelDesign());
  const selectedElementId = useConfiguratorStore((s) => s.selectedElementId);
  const updateDesignElement = useConfiguratorStore((s) => s.updateDesignElement);

  const selectedElement = activePanelDesign.elements.find((el) => el.id === selectedElementId);

  if (!selectedElement) {
    return (
      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/60 text-center text-xs text-slate-500 select-none">
        Click any text or logo element on the canvas to inspect & edit its properties.
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-slate-900 border border-slate-800 p-3.5 space-y-3 text-xs select-none">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <span className="font-bold text-white uppercase tracking-wider text-[11px]">
          Edit {selectedElement.type === 'text' ? 'Text Element' : 'Image Logo'}
        </span>
        <span className="text-[10px] font-mono text-slate-400">ID: {selectedElement.id.slice(-6)}</span>
      </div>

      {/* Text Content Input */}
      {selectedElement.type === 'text' && (
        <div className="space-y-1.5">
          <label className="text-[11px] font-medium text-slate-400">Text Content</label>
          <input
            type="text"
            value={selectedElement.content}
            onChange={(e) =>
              updateDesignElement(activePanel.id, selectedElement.id, { content: e.target.value })
            }
            className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500 text-xs"
            placeholder="Enter text..."
          />
        </div>
      )}

      {/* Text Styling Controls */}
      {selectedElement.type === 'text' && (
        <div className="grid grid-cols-2 gap-3 pt-1">
          {/* Font Size */}
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-400">Font Size ({selectedElement.fontSize || 32}px)</label>
            <input
              type="range"
              min="14"
              max="96"
              value={selectedElement.fontSize || 32}
              onChange={(e) =>
                updateDesignElement(activePanel.id, selectedElement.id, {
                  fontSize: parseInt(e.target.value, 10),
                })
              }
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>

          {/* Font Color */}
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-400">Font Color</label>
            <div className="flex items-center gap-2 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
              <input
                type="color"
                value={selectedElement.fontColor || '#ffffff'}
                onChange={(e) =>
                  updateDesignElement(activePanel.id, selectedElement.id, {
                    fontColor: e.target.value,
                  })
                }
                className="h-5 w-5 rounded bg-transparent cursor-pointer border-0 p-0"
              />
              <span className="text-[11px] font-mono text-slate-300 uppercase">
                {selectedElement.fontColor || '#ffffff'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Alignment & Weight */}
      {selectedElement.type === 'text' && (
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center bg-slate-950 rounded-lg p-0.5 border border-slate-800">
            <button
              onClick={() =>
                updateDesignElement(activePanel.id, selectedElement.id, { textAlign: 'left' })
              }
              className={`p-1.5 rounded ${
                selectedElement.textAlign === 'left' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Align Left"
            >
              <AlignLeft className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() =>
                updateDesignElement(activePanel.id, selectedElement.id, { textAlign: 'center' })
              }
              className={`p-1.5 rounded ${
                selectedElement.textAlign === 'center' || !selectedElement.textAlign
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Align Center"
            >
              <AlignCenter className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() =>
                updateDesignElement(activePanel.id, selectedElement.id, { textAlign: 'right' })
              }
              className={`p-1.5 rounded ${
                selectedElement.textAlign === 'right' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Align Right"
            >
              <AlignRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <button
            onClick={() =>
              updateDesignElement(activePanel.id, selectedElement.id, {
                fontWeight: selectedElement.fontWeight === 'bold' ? 'normal' : 'bold',
              })
            }
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs border ${
              selectedElement.fontWeight === 'bold'
                ? 'bg-blue-600/20 text-blue-400 border-blue-500/40 font-bold'
                : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            <Bold className="h-3.5 w-3.5" />
            <span>Bold</span>
          </button>
        </div>
      )}

      {/* Rotation & Size Transform */}
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
            <span>Rotation</span>
            <span className="font-mono text-slate-300">{Math.round(selectedElement.rotation)}°</span>
          </label>
          <div className="flex items-center gap-2">
            <RotateCw className="h-3.5 w-3.5 text-slate-500 shrink-0" />
            <input
              type="range"
              min="-180"
              max="180"
              value={selectedElement.rotation}
              onChange={(e) =>
                updateDesignElement(activePanel.id, selectedElement.id, {
                  rotation: parseInt(e.target.value, 10),
                })
              }
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
            <span>Width Scale</span>
            <span className="font-mono text-slate-300">{Math.round(selectedElement.width)}px</span>
          </label>
          <input
            type="range"
            min="40"
            max={activePanel.artboardWidth * 0.95}
            value={selectedElement.width}
            onChange={(e) =>
              updateDesignElement(activePanel.id, selectedElement.id, {
                width: parseInt(e.target.value, 10),
              })
            }
            className="w-full accent-blue-500 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
