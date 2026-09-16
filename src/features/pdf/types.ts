import { ConfiguratorState } from '@/core/state/types';
import { PricingResponse } from '@/features/pricing/types';
import { ShopifyCartPayload } from '@/features/shopify/types';

export interface PDFElementSummary {
  type: 'text' | 'image';
  content: string;
  position: string;
  size: string;
  details?: string;
}

export interface PDFPanelSummary {
  panelId: string;
  panelLabel: string;
  elements: PDFElementSummary[];
}

export interface ProductionSummaryData {
  configurationId: string;
  generatedAt: string;
  product: {
    id: string;
    name: string;
    sizeLabel: string;
    dimensions: string;
    area: string;
  };
  options: {
    canopyColor: string;
    canopyColorHex: string;
    frameFinish: string;
    quantity: number;
  };
  customization: {
    customizedPanelsCount: number;
    panels: PDFPanelSummary[];
    preview2DDataUrl?: string;
    preview3DDataUrl?: string;
  };
  pricing: PricingResponse;
  shopifyData: ShopifyCartPayload;
}

export interface PDFExportOptions {
  include3DPreview?: boolean;
  include2DPreview?: boolean;
}

export interface IPDFService {
  buildProductionSummaryData(
    state: ConfiguratorState,
    pricing: PricingResponse,
    shopifyData: ShopifyCartPayload,
    previews?: { preview2DDataUrl?: string; preview3DDataUrl?: string }
  ): ProductionSummaryData;

  generatePDF(data: ProductionSummaryData): Promise<Blob>;
}

