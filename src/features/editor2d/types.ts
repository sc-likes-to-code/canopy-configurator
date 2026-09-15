export interface GraphicElement {
  id: string;
  type: 'text' | 'image';
  x: number;
  y: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  content: string;
}

export interface PanelCanvasState {
  panelId: string;
  width: number;
  height: number;
  elements: GraphicElement[];
}

export interface I2DEditorSync {
  exportTextureCanvas(panelId: string): Promise<HTMLCanvasElement>;
}
