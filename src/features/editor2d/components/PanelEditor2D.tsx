import React, { useRef, useState, useCallback, useLayoutEffect } from 'react';
import { useConfiguratorStore } from '@/core/state/useConfiguratorStore';
import { DesignElement } from '@/core/state/types';
import { Move } from 'lucide-react';

export const PanelEditor2D: React.FC = () => {
  const activePanel = useConfiguratorStore((s) => s.getActivePanel());
  const activePanelDesign = useConfiguratorStore((s) => s.getActivePanelDesign());
  const activeCanopyColor = useConfiguratorStore((s) => s.getActiveCanopyColor());
  const selectedElementId = useConfiguratorStore((s) => s.selectedElementId);
  const setSelectedElementId = useConfiguratorStore((s) => s.setSelectedElementId);
  const updateDesignElement = useConfiguratorStore((s) => s.updateDesignElement);

  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(400);
  const [draggingElementId, setDraggingElementId] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState<{ mouseX: number; mouseY: number; initialX: number; initialY: number } | null>(null);

  // Track container width for fluid font size rendering
  useLayoutEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const artboardWidth = activePanel.artboardWidth;
  const artboardHeight = activePanel.artboardHeight;
  const artboardBgColor = activePanelDesign.backgroundColor || activeCanopyColor.colorHex;

  // Handle element selection & start drag
  const handleElementPointerDown = (e: React.PointerEvent, element: DesignElement) => {
    e.stopPropagation();
    // Seamlessly select clicked element
    setSelectedElementId(element.id);
    setDraggingElementId(element.id);
    setDragStart({
      mouseX: e.clientX,
      mouseY: e.clientY,
      initialX: element.x,
      initialY: element.y,
    });
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!draggingElementId || !dragStart || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const scaleX = artboardWidth / rect.width;
      const scaleY = artboardHeight / rect.height;

      const deltaMouseX = (e.clientX - dragStart.mouseX) * scaleX;
      const deltaMouseY = (e.clientY - dragStart.mouseY) * scaleY;

      const newX = Math.round(dragStart.initialX + deltaMouseX);
      const newY = Math.round(dragStart.initialY + deltaMouseY);

      updateDesignElement(activePanel.id, draggingElementId, {
        x: newX,
        y: newY,
      });
    },
    [draggingElementId, dragStart, artboardWidth, artboardHeight, activePanel.id, updateDesignElement]
  );

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (draggingElementId) {
      setDraggingElementId(null);
      setDragStart(null);
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Safe fallback
      }
    }
  }, [draggingElementId]);

  // Click on empty artboard area deselects elements
  const handleArtboardClick = (e: React.MouseEvent) => {
    // Only deselect if user clicked directly on the artboard background/grid
    if (e.target === containerRef.current || e.target === gridRef.current) {
      setSelectedElementId(null);
    }
  };

  const handleElementClick = (e: React.MouseEvent, element: DesignElement) => {
    e.stopPropagation();
    setSelectedElementId(element.id);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full select-none p-3">
      {/* Artboard Container */}
      <div
        ref={containerRef}
        onClick={handleArtboardClick}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="relative shadow-2xl rounded-lg overflow-hidden border border-slate-700/80 cursor-crosshair transition-colors duration-200"
        style={{
          width: '100%',
          maxWidth: `${artboardWidth}px`,
          aspectRatio: `${artboardWidth} / ${artboardHeight}`,
          backgroundColor: artboardBgColor,
        }}
      >
        {/* Grid Guidelines Background */}
        <div
          ref={gridRef}
          onClick={handleArtboardClick}
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:16px_16px]"
        />

        {/* Artboard Panel Title Overlay Badge */}
        <div className="absolute top-2 left-2 px-2.5 py-1 rounded bg-slate-900/80 border border-slate-700/60 text-[11px] font-semibold text-slate-300 pointer-events-none z-10 backdrop-blur-sm">
          {activePanel.label} ({artboardWidth} × {artboardHeight})
        </div>

        {/* Design Elements Layer */}
        {activePanelDesign.elements.map((element) => {
          const isSelected = selectedElementId === element.id;

          // Compute CSS percentage positioning for responsive rendering
          const leftPct = (element.x / artboardWidth) * 100;
          const topPct = (element.y / artboardHeight) * 100;
          const widthPct = (element.width / artboardWidth) * 100;

          return (
            <div
              key={element.id}
              onClick={(e) => handleElementClick(e, element)}
              onPointerDown={(e) => handleElementPointerDown(e, element)}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing transition-shadow ${
                isSelected ? 'ring-2 ring-blue-400 ring-offset-1 ring-offset-slate-900 z-20' : 'hover:ring-1 hover:ring-blue-400/60'
              }`}
              style={{
                left: `${leftPct}%`,
                top: `${topPct}%`,
                width: `${widthPct}%`,
                transform: `translate(-50%, -50%) rotate(${element.rotation}deg)`,
              }}
            >
              {element.type === 'text' ? (
                <div
                  style={{
                    fontSize: `${(element.fontSize || 32) * (containerWidth > 0 ? containerWidth / artboardWidth : 0.5)}px`,
                    color: element.fontColor || '#ffffff',
                    fontFamily: element.fontFamily || 'Inter',
                    fontWeight: element.fontWeight || 'bold',
                    textAlign: element.textAlign || 'center',
                    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                  }}
                  className="w-full break-words leading-tight"
                >
                  {element.content}
                </div>
              ) : (
                <img
                  src={element.content}
                  alt="Uploaded Logo"
                  className="w-full h-auto object-contain pointer-events-none drop-shadow-md"
                />
              )}

              {/* Selection Handles & Controls */}
              {isSelected && (
                <div className="absolute -inset-1 border border-blue-400 border-dashed pointer-events-none">
                  <div className="absolute -top-3 -right-3 h-5 w-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow">
                    <Move className="h-3 w-3" />
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Empty State Instructions */}
        {activePanelDesign.elements.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 pointer-events-none opacity-60">
            <span className="text-xs font-medium text-slate-300">Empty Panel Canvas</span>
            <span className="text-[11px] text-slate-400 mt-0.5">Use the toolbar to add text or upload your logo</span>
          </div>
        )}
      </div>
    </div>
  );
};
