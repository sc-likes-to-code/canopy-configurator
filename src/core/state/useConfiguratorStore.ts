import { create } from 'zustand';
import { ConfiguratorState, PanelDesignState, DesignElement } from './types';
import { PRODUCTS, CANOPY_COLOR_OPTIONS, FRAME_FINISH_OPTIONS, getProductById, SHARED_PANELS } from '@/catalog/products';

const DEFAULT_PRODUCT = PRODUCTS[0];
const DEFAULT_PANEL = SHARED_PANELS[0];

const INITIAL_PANEL_DESIGNS: Record<string, PanelDesignState> = {
  'valance-front': {
    panelId: 'valance-front',
    elements: [
      {
        id: 'valance-default-logo',
        type: 'text',
        x: 400,
        y: 100,
        width: 380,
        height: 50,
        rotation: 0,
        content: 'CANOPY STUDIO',
        fontSize: 36,
        fontColor: '#ffffff',
        fontFamily: 'Inter',
        fontWeight: 'bold',
        textAlign: 'center',
      },
    ],
  },
  'roof-front': {
    panelId: 'roof-front',
    elements: [],
  },
  'roof-side': {
    panelId: 'roof-side',
    elements: [],
  },
};

export const useConfiguratorStore = create<ConfiguratorState>((set, get) => ({
  selectedProductId: DEFAULT_PRODUCT.id,
  canopyColorId: DEFAULT_PRODUCT.defaultCanopyColorId,
  frameFinishId: DEFAULT_PRODUCT.defaultFrameFinishId,
  quantity: 1,
  selectedPanelId: DEFAULT_PANEL.id,
  selectedElementId: null,

  panelDesigns: INITIAL_PANEL_DESIGNS,

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

  getActivePanel: () => {
    const { selectedPanelId } = get();
    const product = get().getActiveProduct();
    return product.panels.find((p) => p.id === selectedPanelId) || product.panels[0] || DEFAULT_PANEL;
  },

  getActivePanelDesign: () => {
    const { selectedPanelId, panelDesigns } = get();
    return (
      panelDesigns[selectedPanelId] || {
        panelId: selectedPanelId,
        elements: [],
      }
    );
  },

  setSelectedProduct: (productId: string) => {
    const product = getProductById(productId);
    if (!product) return;

    const { canopyColorId, frameFinishId } = get();

    const isColorSupported = product.availableCanopyColors.some((c) => c.id === canopyColorId);
    const newColorId = isColorSupported
      ? canopyColorId
      : product.defaultCanopyColorId || product.availableCanopyColors[0]?.id || canopyColorId;

    const isFinishSupported = product.availableFrameFinishes.some((f) => f.id === frameFinishId);
    const newFinishId = isFinishSupported
      ? frameFinishId
      : product.defaultFrameFinishId || product.availableFrameFinishes[0]?.id || frameFinishId;

    set({
      selectedProductId: productId,
      canopyColorId: newColorId,
      frameFinishId: newFinishId,
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

  setSelectedPanel: (panelId: string) => {
    const product = get().getActiveProduct();
    const panel = product.panels.find((p) => p.id === panelId);

    set({
      selectedPanelId: panelId,
      selectedElementId: null,
      cameraPreset: panel ? panel.cameraPreset : 'default',
    });
  },

  setSelectedElementId: (elementId: string | null) => {
    set({ selectedElementId: elementId });
  },

  setPanelBackgroundColor: (panelId: string, color: string | undefined) => {
    set((state) => {
      const current = state.panelDesigns[panelId] || { panelId, elements: [] };
      return {
        panelDesigns: {
          ...state.panelDesigns,
          [panelId]: {
            ...current,
            backgroundColor: color,
          },
        },
      };
    });
  },

  addTextElement: (panelId: string, text = 'YOUR LOGO / TEXT') => {
    const newId = `text-${Date.now()}`;
    const product = get().getActiveProduct();
    const panel = product.panels.find((p) => p.id === panelId) || DEFAULT_PANEL;

    const newElement: DesignElement = {
      id: newId,
      type: 'text',
      x: panel.artboardWidth / 2,
      y: panel.artboardHeight / 2,
      width: Math.min(400, panel.artboardWidth * 0.7),
      height: 60,
      rotation: 0,
      content: text,
      fontSize: 32,
      fontColor: '#ffffff',
      fontFamily: 'Inter',
      fontWeight: 'bold',
      textAlign: 'center',
    };

    set((state) => {
      const current = state.panelDesigns[panelId] || { panelId, elements: [] };
      return {
        selectedElementId: newId,
        panelDesigns: {
          ...state.panelDesigns,
          [panelId]: {
            ...current,
            elements: [...current.elements, newElement],
          },
        },
      };
    });

    return newId;
  },

  addImageElement: (panelId: string, imageSrc: string, width = 200, height = 200) => {
    const newId = `image-${Date.now()}`;
    const product = get().getActiveProduct();
    const panel = product.panels.find((p) => p.id === panelId) || DEFAULT_PANEL;

    // Scale down image to fit artboard nicely
    const maxW = panel.artboardWidth * 0.6;
    const maxH = panel.artboardHeight * 0.6;
    let finalW = width;
    let finalH = height;

    if (finalW > maxW || finalH > maxH) {
      const scale = Math.min(maxW / finalW, maxH / finalH);
      finalW = Math.round(finalW * scale);
      finalH = Math.round(finalH * scale);
    }

    const newElement: DesignElement = {
      id: newId,
      type: 'image',
      x: panel.artboardWidth / 2,
      y: panel.artboardHeight / 2,
      width: finalW,
      height: finalH,
      rotation: 0,
      content: imageSrc,
    };

    set((state) => {
      const current = state.panelDesigns[panelId] || { panelId, elements: [] };
      return {
        selectedElementId: newId,
        panelDesigns: {
          ...state.panelDesigns,
          [panelId]: {
            ...current,
            elements: [...current.elements, newElement],
          },
        },
      };
    });

    return newId;
  },

  updateDesignElement: (panelId: string, elementId: string, updates: Partial<DesignElement>) => {
    set((state) => {
      const current = state.panelDesigns[panelId];
      if (!current) return state;

      const updatedElements = current.elements.map((el) => {
        if (el.id === elementId) {
          return { ...el, ...updates };
        }
        return el;
      });

      return {
        panelDesigns: {
          ...state.panelDesigns,
          [panelId]: {
            ...current,
            elements: updatedElements,
          },
        },
      };
    });
  },

  removeDesignElement: (panelId: string, elementId: string) => {
    set((state) => {
      const current = state.panelDesigns[panelId];
      if (!current) return state;

      const updatedElements = current.elements.filter((el) => el.id !== elementId);

      return {
        selectedElementId: state.selectedElementId === elementId ? null : state.selectedElementId,
        panelDesigns: {
          ...state.panelDesigns,
          [panelId]: {
            ...current,
            elements: updatedElements,
          },
        },
      };
    });
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
      selectedPanelId: DEFAULT_PANEL.id,
      selectedElementId: null,
      panelDesigns: INITIAL_PANEL_DESIGNS,
      autoRotate: false,
      showGrid: true,
      cameraPreset: 'default',
    });
  },
}));
