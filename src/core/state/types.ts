import { CanopyColorOption, FrameFinishOption, ProductDefinition } from '@/catalog/types';

export type CameraPreset = 'default' | 'front' | 'side' | 'top';

export interface ConfiguratorState {
  // Product Selection
  selectedProductId: string;
  
  // Customization Selections
  canopyColorId: string;
  frameFinishId: string;
  quantity: number;
  selectedPanelId: string | null;

  // Viewport / Rendering Controls
  autoRotate: boolean;
  showGrid: boolean;
  cameraPreset: CameraPreset;

  // Derived Helpers / Computed Accessors
  getActiveProduct: () => ProductDefinition;
  getActiveCanopyColor: () => CanopyColorOption;
  getActiveFrameFinish: () => FrameFinishOption;

  // Actions
  setSelectedProduct: (productId: string) => void;
  setCanopyColor: (colorId: string) => void;
  setFrameFinish: (finishId: string) => void;
  setQuantity: (quantity: number) => void;
  setSelectedPanel: (panelId: string | null) => void;
  setAutoRotate: (enabled: boolean) => void;
  setShowGrid: (enabled: boolean) => void;
  setCameraPreset: (preset: CameraPreset) => void;
  resetConfiguration: () => void;
}
