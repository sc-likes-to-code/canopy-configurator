import { jsPDF } from 'jspdf';
import { IPDFService, ProductionSummaryData, PDFPanelSummary, PDFElementSummary } from './types';
import { ConfiguratorState } from '@/core/state/types';
import { PricingResponse } from '@/features/pricing/types';
import { ShopifyCartPayload } from '@/features/shopify/types';

export class PDFService implements IPDFService {
  buildProductionSummaryData(
    state: ConfiguratorState,
    pricing: PricingResponse,
    shopifyData: ShopifyCartPayload,
    previews?: { preview2DDataUrl?: string; preview3DDataUrl?: string }
  ): ProductionSummaryData {
    const activeProduct = state.getActiveProduct();
    const activeColor = state.getActiveCanopyColor();
    const activeFinish = state.getActiveFrameFinish();

    // Unique configuration ID format: CS-YYYYMMDD-XXXX
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomHex = Math.floor(Math.random() * 0xffff)
      .toString(16)
      .padStart(4, '0')
      .toUpperCase();
    const configurationId = `CS-${dateStr}-${randomHex}`;

    const panels: PDFPanelSummary[] = [];
    let customizedPanelsCount = 0;

    Object.entries(state.panelDesigns).forEach(([panelId, design]) => {
      if (design?.elements && design.elements.length > 0) {
        customizedPanelsCount++;
        const panelDef = activeProduct.panels.find((p) => p.id === panelId);
        const elements: PDFElementSummary[] = design.elements.map((el) => {
          if (el.type === 'text') {
            return {
              type: 'text',
              content: el.content,
              position: `X: ${Math.round(el.x)}, Y: ${Math.round(el.y)}`,
              size: `${Math.round(el.width)} x ${Math.round(el.height)} px`,
              details: `Font: ${el.fontSize || 32}px ${el.fontFamily || 'Inter'}, Color: ${el.fontColor || '#ffffff'}, Align: ${el.textAlign || 'center'}`,
            };
          } else {
            return {
              type: 'image',
              content: 'Custom Logo Graphic',
              position: `X: ${Math.round(el.x)}, Y: ${Math.round(el.y)}`,
              size: `${Math.round(el.width)} x ${Math.round(el.height)} px`,
              details: 'Uploaded Raster/Vector Graphic Asset',
            };
          }
        });

        panels.push({
          panelId,
          panelLabel: panelDef ? panelDef.label : panelId,
          elements,
        });
      }
    });

    return {
      configurationId,
      generatedAt: new Date().toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      product: {
        id: activeProduct.id,
        name: activeProduct.name,
        sizeLabel: activeProduct.sizeLabel,
        dimensions: `${activeProduct.dimensions.widthFeet}' x ${activeProduct.dimensions.depthFeet}' (Peak: ${activeProduct.dimensions.peakHeightFeet}')`,
        area: `${activeProduct.dimensions.footprintAreaSqFt} sq ft`,
      },
      options: {
        canopyColor: activeColor.name,
        canopyColorHex: activeColor.colorHex,
        frameFinish: activeFinish.name,
        quantity: state.quantity,
      },
      customization: {
        customizedPanelsCount,
        panels,
        preview2DDataUrl: previews?.preview2DDataUrl,
        preview3DDataUrl: previews?.preview3DDataUrl,
      },
      pricing,
      shopifyData,
    };
  }

  async generatePDF(data: ProductionSummaryData): Promise<Blob> {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 14;
    const contentWidth = pageWidth - margin * 2;

    // Helper functions for PDF styling
    const drawHeader = (pageNum: number, totalPages: number) => {
      // Top Navy Header Banner
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, pageWidth, 28, 'F');

      // Brand Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(255, 255, 255);
      doc.text('CANOPY STUDIO', margin, 12);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(148, 163, 184); // slate-400
      doc.text('COMMERCIAL CANOPY PRODUCTION SUMMARY & SPEC SHEET', margin, 18);

      // Config ID Pill right aligned
      doc.setFillColor(37, 99, 235); // blue-600
      doc.roundedRect(pageWidth - margin - 48, 8, 48, 12, 2, 2, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text(`ID: ${data.configurationId}`, pageWidth - margin - 24, 15.5, { align: 'center' });

      // Footer
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(`Generated on ${data.generatedAt} | Canopy Studio Configurator`, margin, pageHeight - 7);
      doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - margin, pageHeight - 7, { align: 'right' });
    };

    // --- PAGE 1: Specifications, Pricing, Previews ---
    drawHeader(1, 2);
    let y = 35;

    // SECTION 1: Product Specifications & Order Options (Left Column & Right Column)
    doc.setFillColor(248, 250, 252); // slate-50
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, 38, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text('1. Product Specifications & Options', margin + 4, y + 7);

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);

    // Left Column
    doc.text(`• Product Model:`, margin + 4, y + 15);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(`${data.product.name}`, margin + 30, y + 15);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(`• Dimensions:`, margin + 4, y + 22);
    doc.text(`${data.product.dimensions} (${data.product.area})`, margin + 30, y + 22);

    doc.text(`• Quantity:`, margin + 4, y + 29);
    doc.setFont('helvetica', 'bold');
    doc.text(`${data.options.quantity} Unit(s)`, margin + 30, y + 29);

    // Right Column
    const col2X = margin + 95;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(`• Canopy Color:`, col2X, y + 15);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(`${data.options.canopyColor} (${data.options.canopyColorHex})`, col2X + 26, y + 15);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(`• Frame Finish:`, col2X, y + 22);
    doc.setFont('helvetica', 'bold');
    doc.text(`${data.options.frameFinish}`, col2X + 26, y + 22);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(`• Custom Panels:`, col2X, y + 29);
    doc.setFont('helvetica', 'bold');
    doc.text(`${data.customization.customizedPanelsCount} Panel(s) Customized`, col2X + 26, y + 29);

    y += 44;

    // SECTION 2: Pricing Breakdown Table
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text('2. Pricing & Commercial Summary', margin, y);
    y += 4;

    // Table Header
    doc.setFillColor(241, 245, 249); // slate-100
    doc.rect(margin, y, contentWidth, 7, 'F');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(51, 65, 85);
    doc.text('Item Description', margin + 4, y + 4.5);
    doc.text('Amount', pageWidth - margin - 4, y + 4.5, { align: 'right' });
    y += 7;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);

    data.pricing.breakdown.forEach((item) => {
      doc.setDrawColor(241, 245, 249);
      doc.line(margin, y + 6, pageWidth - margin, y + 6);
      doc.setTextColor(51, 65, 85);
      doc.text(item.label, margin + 4, y + 4.5);
      doc.text(`Rs. ${item.amount.toLocaleString('en-IN')}`, pageWidth - margin - 4, y + 4.5, {
        align: 'right',
      });
      y += 6.5;
    });

    // Subtotal & Total lines
    doc.setFillColor(248, 250, 252);
    doc.rect(margin, y, contentWidth, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(`Total Price (${data.options.quantity} Unit${data.options.quantity > 1 ? 's' : ''}):`, margin + 4, y + 5.5);
    doc.setTextColor(37, 99, 235);
    doc.text(`Rs. ${data.pricing.totalPrice.toLocaleString('en-IN')}`, pageWidth - margin - 4, y + 5.5, {
      align: 'right',
    });

    y += 14;

    // SECTION 3: Visual Previews (3D Model & 2D Texture Map)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text('3. Configuration Visual Previews', margin, y);
    y += 5;

    const previewBoxW = (contentWidth - 6) / 2;
    const previewBoxH = 65;

    // 3D Preview Frame
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, previewBoxW, previewBoxH, 2, 2, 'FD');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text('3D Interactive Model Snapshot', margin + 4, y + 5);

    if (data.customization.preview3DDataUrl) {
      try {
        doc.addImage(
          data.customization.preview3DDataUrl,
          'PNG',
          margin + 2,
          y + 7,
          previewBoxW - 4,
          previewBoxH - 9
        );
      } catch (e) {
        console.warn('PDF 3D image embed warning:', e);
      }
    }

    // 2D Preview Frame
    const prev2DX = margin + previewBoxW + 6;
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(prev2DX, y, previewBoxW, previewBoxH, 2, 2, 'FD');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text('2D Master Texture & Print Map', prev2DX + 4, y + 5);

    if (data.customization.preview2DDataUrl) {
      try {
        doc.addImage(
          data.customization.preview2DDataUrl,
          'PNG',
          prev2DX + 2,
          y + 7,
          previewBoxW - 4,
          previewBoxH - 9
        );
      } catch (e) {
        console.warn('PDF 2D image embed warning:', e);
      }
    }

    // --- PAGE 2: Customized Panel Mapping & Shopify Order Data ---
    doc.addPage();
    drawHeader(2, 2);
    y = 35;

    // SECTION 4: Detailed Panel Customization Elements
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text('4. Detailed Customization & Graphics Specification', margin, y);
    y += 5;

    if (data.customization.panels.length === 0) {
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(margin, y, contentWidth, 18, 2, 2, 'F');
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text('No custom text or logo graphics applied. Standard solid canopy color configuration.', margin + 4, y + 10);
      y += 24;
    } else {
      data.customization.panels.forEach((panel) => {
        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(226, 232, 240);
        const cardH = 12 + panel.elements.length * 10;
        doc.roundedRect(margin, y, contentWidth, cardH, 2, 2, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(37, 99, 235);
        doc.text(`Panel: ${panel.panelLabel}`, margin + 4, y + 6);

        let elemY = y + 12;
        panel.elements.forEach((el, idx) => {
          doc.setFontSize(8);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(15, 23, 42);
          doc.text(`#${idx + 1} [${el.type.toUpperCase()}] "${el.content}"`, margin + 6, elemY);

          doc.setFont('helvetica', 'normal');
          doc.setTextColor(100, 116, 139);
          doc.text(`Pos: ${el.position} | Size: ${el.size} ${el.details ? `| ${el.details}` : ''}`, margin + 6, elemY + 4.5);
          elemY += 10;
        });

        y += cardH + 4;
      });
    }

    // SECTION 5: Production & Shopify Cart Line Item Attributes
    y += 4;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text('5. Shopify Order Line Item & Manufacturing Attributes', margin, y);
    y += 5;

    const lineItem = data.shopifyData.lineItems[0];
    if (lineItem) {
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      const attrsHeight = 10 + lineItem.customAttributes.length * 5.5;
      doc.roundedRect(margin, y, contentWidth, attrsHeight, 2, 2, 'FD');

      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(`Shopify Product Variant GID: ${lineItem.variantId}`, margin + 4, y + 6);

      let attrY = y + 12;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      lineItem.customAttributes.forEach((attr) => {
        doc.setTextColor(71, 85, 105);
        doc.text(`• ${attr.key}:`, margin + 4, attrY);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text(attr.value.replace(/₹/g, 'Rs. '), margin + 50, attrY);
        doc.setFont('helvetica', 'normal');
        attrY += 5.5;
      });
    }

    return doc.output('blob');
  }
}

export const pdfService = new PDFService();
