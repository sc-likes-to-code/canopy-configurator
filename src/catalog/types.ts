/**
 * Catalog data structures for product definitions, frame finishes, and fabric colors.
 */

export interface TentDimensions {
  widthFeet: number;
  depthFeet: number;
  peakHeightFeet: number;
  footprintAreaSqFt: number;
}

export interface FrameFinishOption {
  id: string;
  name: string;
  colorHex: string;
  materialName: string;
  description: string;
}

export interface CanopyColorOption {
  id: string;
  name: string;
  colorHex: string;
  materialName: string;
}

export interface PanelDefinition {
  id: string;
  name: string;
  description: string;
}

export interface ProductDefinition {
  id: string;
  name: string;
  tagline: string;
  sizeLabel: string;
  scale: [number, number, number];
  dimensions: TentDimensions;
  modelUrl: string;
  description: string;
  defaultFrameFinishId: string;
  defaultCanopyColorId: string;
  availableFrameFinishes: FrameFinishOption[];
  availableCanopyColors: CanopyColorOption[];
  panels: PanelDefinition[];
}
