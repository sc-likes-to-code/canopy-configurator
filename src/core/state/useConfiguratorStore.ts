import { create } from 'zustand';
import { ConfiguratorState } from './types';
import { PRODUCTS, CANOPY_COLOR_OPTIONS, FRAME_FINISH_OPTIONS, getProductById } from '@/catalog/products';

const DEFAULT_PRODUCT = PRODUCTS[0];

export const useConfiguratorStore = create<ConfiguratorState>((set, get) => ({
  selectedProductId: DEFAULT_PRODUCT.id,
  canopyColorId: DEFAULT_PRODUCT.defaultCanopyColorId,
  frameFinishId: DEFAULT_PRODUCT.defaultFrameFinishId,
  quantity: 1,
  selectedPanelId: null,

  autoRotate: false,
  showGrid: true,
  cameraPreset: 'default',

  getActiveProduct: () => {
    const { selectedProductId } = get();
    return getProductById(selectedProductId) || DEFAULT_PRODUCT;
  },

  getActiveCanopyColor: () => {
    const { canopyColorId } = get();
    const product = get().getActiveProduct();
    return (
      product.availableCanopyColors.find((c) => c.id === canopyColorId) ||
      CANOPY_COLOR_OPTIONS.find((c) => c.id === canopyColorId) ||
      product.availableCanopyColors[0] ||
      CANOPY_COLOR_OPTIONS[0]
    );
  },

  getActiveFrameFinish: () => {
    const { frameFinishId } = get();
    const product = get().getActiveProduct();
    return (
      product.availableFrameFinishes.find((f) => f.id === frameFinishId) ||
      FRAME_FINISH_OPTIONS.find((f) => f.id === frameFinishId) ||
      product.availableFrameFinishes[0] ||
      FRAME_FINISH_OPTIONS[0]
    );
  },

  setSelectedProduct: (productId: string) => {
    const product = getProductById(productId);
    if (!product) return;

    const { canopyColorId, frameFinishId } = get();

    // Preserve canopy color if supported by the new product, else fallback safely
    const isColorSupported = product.availableCanopyColors.some((c) => c.id === canopyColorId);
    const newColorId = isColorSupported
      ? canopyColorId
      : product.defaultCanopyColorId || product.availableCanopyColors[0]?.id || canopyColorId;

    // Preserve frame finish if supported by the new product, else fallback safely
    const isFinishSupported = product.availableFrameFinishes.some((f) => f.id === frameFinishId);
    const newFinishId = isFinishSupported
      ? frameFinishId
      : product.defaultFrameFinishId || product.availableFrameFinishes[0]?.id || frameFinishId;

    set({
      selectedProductId: productId,
      canopyColorId: newColorId,
      frameFinishId: newFinishId,
      selectedPanelId: null,
    });
  },

  setCanopyColor: (colorId: string) => {
    set({ canopyColorId: colorId });
  },

  setFrameFinish: (finishId: string) => {
    set({ frameFinishId: finishId });
  },

  setQuantity: (quantity: number) => {
    const validQty = Math.max(1, Math.min(100, Math.floor(quantity)));
    set({ quantity: validQty });
  },

  setSelectedPanel: (panelId: string | null) => {
    set({ selectedPanelId: panelId });
  },

  setAutoRotate: (enabled: boolean) => {
    set({ autoRotate: enabled });
  },

  setShowGrid: (enabled: boolean) => {
    set({ showGrid: enabled });
  },

  setCameraPreset: (preset) => {
    set({ cameraPreset: preset });
  },

  resetConfiguration: () => {
    const product = get().getActiveProduct();
    set({
      canopyColorId: product.defaultCanopyColorId,
      frameFinishId: product.defaultFrameFinishId,
      quantity: 1,
      selectedPanelId: null,
      autoRotate: false,
      showGrid: true,
      cameraPreset: 'default',
    });
  },
}));
