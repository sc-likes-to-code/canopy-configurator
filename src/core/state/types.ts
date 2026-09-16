import { CanopyColorOption, FrameFinishOption, ProductDefinition, PanelDefinition } from '@/catalog/types';

export type CameraPreset = 'default' | 'front' | 'side' | 'top';

export interface DesignElement {
  id: string;
  type: 'text' | 'image';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number; // degrees
  content: string; // text string or image URL
  fontSize?: number;
  fontColor?: string;
  fontFamily?: string;
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right';
  opacity?: number;
}

export interface PanelDesignState {
  panelId: string;
  backgroundColor?: string;
  elements: DesignElement[];
}

export interface ConfiguratorState {
  // Product Selection
  selectedProductId: string;
  
  // Customization Selections
  canopyColorId: string;
  frameFinishId: string;
  quantity: number;
  selectedPanelId: string;
  selectedElementId: string | null;

  // 2D Panel Branding State
  panelDesigns: Record<string, PanelDesignState>;

  // Viewport / Rendering Controls
  autoRotate: boolean;
  showGrid: boolean;
  cameraPreset: CameraPreset;

  // Derived Helpers / Computed Accessors
  getActiveProduct: () => ProductDefinition;
  getActiveCanopyColor: () => CanopyColorOption;
  getActiveFrameFinish: () => FrameFinishOption;
  getActivePanel: () => PanelDefinition;
  getActivePanelDesign: () => PanelDesignState;

  // Actions
  setSelectedProduct: (productId: string) => void;
  setCanopyColor: (colorId: string) => void;
  setFrameFinish: (finishId: string) => void;
  setQuantity: (quantity: number) => void;
  setSelectedPanel: (panelId: string) => void;
  setSelectedElementId: (elementId: string | null) => void;
  setPanelBackgroundColor: (panelId: string, color: string | undefined) => void;
  addTextElement: (panelId: string, text?: string) => string;
  addImageElement: (panelId: string, imageSrc: string, width?: number, height?: number) => string;
  updateDesignElement: (panelId: string, elementId: string, updates: Partial<DesignElement>) => void;
  removeDesignElement: (panelId: string, elementId: string) => void;
  setAutoRotate: (enabled: boolean) => void;
  setShowGrid: (enabled: boolean) => void;
  setCameraPreset: (preset: CameraPreset) => void;
  resetConfiguration: () => void;
}
