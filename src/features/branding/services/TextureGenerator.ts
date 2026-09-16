import * as THREE from 'three';
import { PanelDesignState, DesignElement } from '@/core/state/types';
import { ProductDefinition, PanelDefinition } from '@/catalog/types';

const IMAGE_CACHE = new Map<string, HTMLImageElement>();

function loadImage(src: string): Promise<HTMLImageElement> {
  if (IMAGE_CACHE.has(src)) {
    return Promise.resolve(IMAGE_CACHE.get(src)!);
  }
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      IMAGE_CACHE.set(src, img);
      resolve(img);
    };
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

export class TextureGenerator {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(width = 2048, height = 2048) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    const context = this.canvas.getContext('2d');
    if (!context) throw new Error('Could not create 2D canvas context');
    this.ctx = context;
  }

  async generateTextureCanvas(
    panelDesigns: Record<string, PanelDesignState>,
    baseFabricColorHex: string,
    product: ProductDefinition
  ): Promise<HTMLCanvasElement> {
    const { width, height } = this.canvas;
    const ctx = this.ctx;

    // 1. Fill base canopy fabric color across full master texture
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = baseFabricColorHex;
    ctx.fillRect(0, 0, width, height);

    // 2. Render each panel region onto the master texture map
    for (const panelDef of product.panels) {
      const design = panelDesigns[panelDef.id];
      if (!design || !panelDef.uvRegion) continue;

      const regX = panelDef.uvRegion.x * width;
      const regY = panelDef.uvRegion.y * height;
      const regW = panelDef.uvRegion.width * width;
      const regH = panelDef.uvRegion.height * height;

      ctx.save();

      // Clip rendering to panel region
      ctx.beginPath();
      ctx.rect(regX, regY, regW, regH);
      ctx.clip();

      // Panel background color override (if set)
      if (design.backgroundColor) {
        ctx.fillStyle = design.backgroundColor;
        ctx.fillRect(regX, regY, regW, regH);
      }

      // Map panel elements from panel artboard space to texture space
      const scaleX = regW / panelDef.artboardWidth;
      const scaleY = regH / panelDef.artboardHeight;

      for (const element of design.elements) {
        await this.renderElement(ctx, element, regX, regY, scaleX, scaleY, panelDef);
      }

      ctx.restore();
    }

    return this.canvas;
  }

  private async renderElement(
    ctx: CanvasRenderingContext2D,
    element: DesignElement,
    regX: number,
    regY: number,
    scaleX: number,
    scaleY: number,
    panelDef: PanelDefinition
  ) {
    const transform = panelDef.textureTransform || {};
    const flipY = transform.flipY ?? false;
    const flipX = transform.flipX ?? false;

    // Map coordinates from 2D artboard space to texture space
    const elX = flipX
      ? regX + (panelDef.artboardWidth - element.x) * scaleX
      : regX + element.x * scaleX;

    const elY = flipY
      ? regY + (panelDef.artboardHeight - element.y) * scaleY
      : regY + element.y * scaleY;

    const elW = element.width * scaleX;
    const elH = element.height * scaleY;

    ctx.save();
    ctx.translate(elX, elY);

    const rotDirection = (flipY ? -1 : 1) * (flipX ? -1 : 1);
    if (element.rotation) {
      ctx.rotate((rotDirection * element.rotation * Math.PI) / 180);
    }
    if (element.opacity !== undefined) {
      ctx.globalAlpha = element.opacity;
    }

    if (element.type === 'text') {
      const fontSize = Math.round((element.fontSize || 32) * Math.min(scaleX, scaleY));
      const fontWeight = element.fontWeight || 'bold';
      const fontFamily = element.fontFamily || 'Inter';
      ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}, sans-serif`;
      ctx.fillStyle = element.fontColor || '#ffffff';
      ctx.textAlign = element.textAlign || 'center';
      ctx.textBaseline = 'middle';

      // Subtle drop shadow for high readability
      ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 2;

      ctx.fillText(element.content, 0, 0);
    } else if (element.type === 'image' && element.content) {
      try {
        const img = await loadImage(element.content);
        ctx.drawImage(img, -elW / 2, -elH / 2, elW, elH);
      } catch (err) {
        console.warn('Failed to draw image element on texture canvas:', err);
      }
    }

    ctx.restore();
  }

  createThreeTexture(): THREE.CanvasTexture {
    const texture = new THREE.CanvasTexture(this.canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.flipY = false; // Unified convention: GLTF UV V-coordinate aligns with WebGL canvas V-coordinate
    texture.needsUpdate = true;
    return texture;
  }
}
