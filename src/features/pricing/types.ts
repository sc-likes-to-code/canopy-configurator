/**
 * Type contracts for future dynamic pricing API integration.
 */

export interface PricingRequestPayload {
  productId: string;
  frameFinishId: string;
  canopyColorId: string;
  quantity: number;
  configuredPanelsCount?: number;
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
