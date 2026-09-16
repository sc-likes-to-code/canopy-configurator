import { CameraPreset } from '@/core/state/types';

/**
 * Catalog data structures for product definitions, frame finishes, fabric colors, and configurable panels.
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

export interface PanelTextureTransform {
  flipY?: boolean;
  flipX?: boolean;
}

export interface PanelDefinition {
  id: string;
  label: string;
  description: string;
  artboardWidth: number;
  artboardHeight: number;
  cameraPreset: CameraPreset;
  // Texture UV placement bounding region on the GLB canopy texture map
  uvRegion?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  // Panel-specific texture orientation adjustments to match GLB UV mapping
  textureTransform?: PanelTextureTransform;
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
