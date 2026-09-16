export interface PricingRequestPayload {
  productId: string;
  frameFinishId: string;
  canopyColorId: string;
  quantity: number;
  panelDesigns?: Record<string, { elements: Array<{ type: 'text' | 'image' }> }>;
}

export interface PricingBreakdownItem {
  label: string;
  amount: number;
}

export interface PricingResponse {
  currency: string;
  unitPrice: number;
  totalPrice: number;
  breakdown: PricingBreakdownItem[];
  isEstimate: boolean;
}

export interface IPricingService {
  calculatePrice(payload: PricingRequestPayload): Promise<PricingResponse>;
}
