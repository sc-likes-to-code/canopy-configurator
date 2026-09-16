import { ConfiguratorState } from '@/core/state/types';
import { TextureGenerator } from '@/features/branding/services/TextureGenerator';

/**
 * Safely captures 3D and 2D canvas snapshots for inclusion in the PDF document.
 */
export async function capturePreviews(state: ConfiguratorState): Promise<{
  preview2DDataUrl?: string;
  preview3DDataUrl?: string;
}> {
  let preview3DDataUrl: string | undefined = undefined;
  let preview2DDataUrl: string | undefined = undefined;

  // 1. Capture 3D WebGL Canvas Snapshot
  try {
    const webglCanvas = document.querySelector('canvas') as HTMLCanvasElement | null;
    if (webglCanvas && webglCanvas.width > 0 && webglCanvas.height > 0) {
      preview3DDataUrl = webglCanvas.toDataURL('image/png');
    }
  } catch (err) {
    console.warn('Could not capture 3D WebGL preview for PDF:', err);
  }

  // 2. Generate 2D Panel Design Texture Snapshot
  try {
    const product = state.getActiveProduct();
    const color = state.getActiveCanopyColor();
    const generator = new TextureGenerator(1024, 1024);
    const canvas2d = await generator.generateTextureCanvas(
      state.panelDesigns,
      color.colorHex,
      product
    );
    preview2DDataUrl = canvas2d.toDataURL('image/png');
  } catch (err) {
    console.warn('Could not generate 2D panel preview for PDF:', err);
  }

  return {
    preview2DDataUrl,
    preview3DDataUrl,
  };
}
