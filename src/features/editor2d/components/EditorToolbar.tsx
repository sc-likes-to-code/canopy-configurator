import React, { useRef } from 'react';
import { useConfiguratorStore } from '@/core/state/useConfiguratorStore';
import { Type, Image as ImageIcon, Trash2, Palette, AlertCircle } from 'lucide-react';

export const EditorToolbar: React.FC = () => {
  const activePanel = useConfiguratorStore((s) => s.getActivePanel());
  const activePanelDesign = useConfiguratorStore((s) => s.getActivePanelDesign());
  const activeCanopyColor = useConfiguratorStore((s) => s.getActiveCanopyColor());
  const selectedElementId = useConfiguratorStore((s) => s.selectedElementId);
  const addTextElement = useConfiguratorStore((s) => s.addTextElement);
  const addImageElement = useConfiguratorStore((s) => s.addImageElement);
  const removeDesignElement = useConfiguratorStore((s) => s.removeDesignElement);
  const setPanelBackgroundColor = useConfiguratorStore((s) => s.setPanelBackgroundColor);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = React.useState<string | null>(null);

  const handleAddText = () => {
    addTextElement(activePanel.id, 'YOUR BRAND TEXT');
  };

  const handleImageUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image format
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Unsupported file type. Please upload a PNG, JPEG, SVG, or WebP image.');
      return;
    }

    // Validate size (< 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size exceeds 10MB limit.');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      addImageElement(activePanel.id, objectUrl, img.width || 200, img.height || 200);
    };
    img.onerror = () => {
      setUploadError('Failed to parse uploaded image file.');
      URL.revokeObjectURL(objectUrl);
    };
    img.src = objectUrl;
  };

  const handleDeleteSelected = () => {
    if (selectedElementId) {
      removeDesignElement(activePanel.id, selectedElementId);
    }
  };

  const currentBgColor = activePanelDesign.backgroundColor || activeCanopyColor.colorHex;

  return (
    <div className="space-y-2 select-none">
      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800 shadow-md">
        <div className="flex items-center gap-1.5">
          {/* Add Text */}
          <button
            onClick={handleAddText}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-sm"
          >
            <Type className="h-3.5 w-3.5" />
            <span>Add Text</span>
          </button>

          {/* Upload Image */}
          <button
            onClick={handleImageUploadClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all border border-slate-700"
          >
            <ImageIcon className="h-3.5 w-3.5 text-emerald-400" />
            <span>Upload Logo</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Custom Panel Bg Color Picker */}
          <label
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-950 border border-slate-800 text-slate-300 cursor-pointer hover:border-slate-700 transition-all"
            title="Custom Panel Background Color"
          >
            <Palette className="h-3.5 w-3.5 text-amber-400" />
            <input
              type="color"
              value={currentBgColor}
              onChange={(e) => setPanelBackgroundColor(activePanel.id, e.target.value)}
              className="h-4 w-4 rounded cursor-pointer bg-transparent border-0 p-0"
            />
            <span className="hidden sm:inline text-[11px]">Bg Color</span>
          </label>
        </div>

        {/* Delete Selected Element */}
        {selectedElementId && (
          <button
            onClick={handleDeleteSelected}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 transition-all"
            title="Delete Selected Element"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete</span>
          </button>
        )}
      </div>

      {/* Upload Error Banner */}
      {uploadError && (
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-950/40 border border-red-900/50 text-xs text-red-300">
          <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}
    </div>
  );
};
