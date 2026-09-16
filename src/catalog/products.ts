import { ProductDefinition, FrameFinishOption, CanopyColorOption, PanelDefinition } from './types';

export const FRAME_FINISH_OPTIONS: FrameFinishOption[] = [
  {
    id: 'silver',
    name: 'Anodized Silver',
    colorHex: '#e2e8f0',
    materialName: 'Metal_mat',
    description: 'Satin anodized aerospace aluminum frame',
  },
  {
    id: 'black',
    name: 'Matte Black',
    colorHex: '#1e293b',
    materialName: 'Metal_mat',
    description: 'Heavy-duty powder coated matte black steel',
  },
  {
    id: 'white',
    name: 'Alpine White',
    colorHex: '#ffffff',
    materialName: 'Metal_mat',
    description: 'Reflective gloss white protective finish',
  },
];

export const CANOPY_COLOR_OPTIONS: CanopyColorOption[] = [
  { id: 'royal-blue', name: 'Royal Blue', colorHex: '#1d4ed8', materialName: 'fabric_Mat' },
  { id: 'crimson-red', name: 'Crimson Red', colorHex: '#dc2626', materialName: 'fabric_Mat' },
  { id: 'stealth-black', name: 'Stealth Black', colorHex: '#18181b', materialName: 'fabric_Mat' },
  { id: 'forest-green', name: 'Forest Green', colorHex: '#16a34a', materialName: 'fabric_Mat' },
  { id: 'pure-white', name: 'Pure White', colorHex: '#ffffff', materialName: 'fabric_Mat' },
  { id: 'sunset-orange', name: 'Sunset Orange', colorHex: '#ea580c', materialName: 'fabric_Mat' },
];

export const SHARED_PANELS: PanelDefinition[] = [
  {
    id: 'valance-front',
    label: 'Front Valance',
    description: 'Flat front perimeter overhang banner panel',
    artboardWidth: 800,
    artboardHeight: 200,
    cameraPreset: 'front',
    uvRegion: { x: 0.26, y: 0.74, width: 0.48, height: 0.22 },
    textureTransform: { flipY: false, flipX: false },
  },
  {
    id: 'roof-front',
    label: 'Front Slope',
    description: 'Primary front triangular canopy roof section',
    artboardWidth: 800,
    artboardHeight: 500,
    cameraPreset: 'front',
    uvRegion: { x: 0.26, y: 0.74, width: 0.48, height: 0.15 },
    textureTransform: { flipY: false, flipX: false },
  },
  {
    id: 'roof-side',
    label: 'Side Slope',
    description: 'Side canopy roof section',
    artboardWidth: 800,
    artboardHeight: 500,
    cameraPreset: 'side',
    uvRegion: { x: 0.65, y: 0.35, width: 0.23, height: 0.30 },
    textureTransform: { flipY: false, flipX: false },
  },
];

export const PRODUCTS: ProductDefinition[] = [
  {
    id: 'tent-5x5',
    name: "5' x 5' Compact Canopy",
    tagline: 'Ideal for tight event booths, sampling pop-ups, and portable kiosks.',
    sizeLabel: "5' x 5'",
    scale: [1.0, 1.0, 1.0],
    dimensions: {
      widthFeet: 5,
      depthFeet: 5,
      peakHeightFeet: 8.5,
      footprintAreaSqFt: 25,
    },
    modelUrl: '/models/Tent_5_5.glb',
    description: 'Compact commercial canopy tent designed for rapid deployment and maximum portability.',
    defaultFrameFinishId: 'silver',
    defaultCanopyColorId: 'royal-blue',
    availableFrameFinishes: FRAME_FINISH_OPTIONS,
    availableCanopyColors: CANOPY_COLOR_OPTIONS,
    panels: SHARED_PANELS,
  },
  {
    id: 'tent-6.5x6.5',
    name: "6.5' x 6.5' Standard Canopy",
    tagline: 'Versatile mid-size canopy optimized for trade shows and outdoor vendor spaces.',
    sizeLabel: "6.5' x 6.5'",
    scale: [1.3, 1.3, 1.3],
    dimensions: {
      widthFeet: 6.5,
      depthFeet: 6.5,
      peakHeightFeet: 9.5,
      footprintAreaSqFt: 42.25,
    },
    modelUrl: '/models/Tent_6.5_6.5.glb',
    description: 'Balanced size offering enhanced shade area while maintaining easy single-person setup.',
    defaultFrameFinishId: 'silver',
    defaultCanopyColorId: 'royal-blue',
    availableFrameFinishes: FRAME_FINISH_OPTIONS,
    availableCanopyColors: CANOPY_COLOR_OPTIONS,
    panels: SHARED_PANELS,
  },
  {
    id: 'tent-8x8',
    name: "8' x 8' Pro Canopy",
    tagline: 'Maximum headroom and coverage for major outdoor exhibitions and sports teams.',
    sizeLabel: "8' x 8'",
    scale: [1.6, 1.6, 1.6],
    dimensions: {
      widthFeet: 8,
      depthFeet: 8,
      peakHeightFeet: 10.5,
      footprintAreaSqFt: 64,
    },
    modelUrl: '/models/Tent_8_8.glb',
    description: 'Heavy-duty professional event tent engineered for high-traffic environments.',
    defaultFrameFinishId: 'silver',
    defaultCanopyColorId: 'royal-blue',
    availableFrameFinishes: FRAME_FINISH_OPTIONS,
    availableCanopyColors: CANOPY_COLOR_OPTIONS,
    panels: SHARED_PANELS,
  },
];

export function getProductById(id: string): ProductDefinition | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
