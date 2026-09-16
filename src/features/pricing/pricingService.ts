import { IPricingService, PricingRequestPayload, PricingResponse, PricingBreakdownItem } from './types';
import { getProductById, FRAME_FINISH_OPTIONS } from '@/catalog/products';

const BASE_PRICES: Record<string, number> = {
  'tent-5x5': 14999,
  'tent-6.5x6.5': 19999,
  'tent-8x8': 27999,
};

const FRAME_FINISH_SURCHARGES: Record<string, number> = {
  silver: 0,
  black: 1500,
  white: 1000,
};

const BRANDING_COSTS = {
  textElement: 499,
  imageElement: 999,
};

export class MockPricingService implements IPricingService {
  async calculatePrice(payload: PricingRequestPayload): Promise<PricingResponse> {
    // Simulate API network latency (120ms)
    await new Promise((resolve) => setTimeout(resolve, 120));

    const product = getProductById(payload.productId);
    const basePrice = BASE_PRICES[payload.productId] ?? 14999;
    const finishSurcharge = FRAME_FINISH_SURCHARGES[payload.frameFinishId] ?? 0;
    const finishOption = FRAME_FINISH_OPTIONS.find((f) => f.id === payload.frameFinishId);

    let textCount = 0;
    let imageCount = 0;

    if (payload.panelDesigns) {
      Object.values(payload.panelDesigns).forEach((design) => {
        if (design?.elements) {
          design.elements.forEach((el) => {
            if (el.type === 'text') textCount++;
            if (el.type === 'image') imageCount++;
          });
        }
      });
    }

    const textCustomizationCost = textCount * BRANDING_COSTS.textElement;
    const imageCustomizationCost = imageCount * BRANDING_COSTS.imageElement;
    const totalCustomizationCost = textCustomizationCost + imageCustomizationCost;

    const unitPrice = basePrice + finishSurcharge + totalCustomizationCost;
    const totalPrice = unitPrice * (payload.quantity || 1);

    const breakdown: PricingBreakdownItem[] = [
      {
        label: `Base Canopy (${product?.sizeLabel || 'Standard'})`,
        amount: basePrice,
      },
    ];

    if (finishSurcharge > 0) {
      breakdown.push({
        label: `Frame Finish (${finishOption?.name || payload.frameFinishId})`,
        amount: finishSurcharge,
      });
    }

    if (textCount > 0) {
      breakdown.push({
        label: `Text Graphics (${textCount} element${textCount > 1 ? 's' : ''})`,
        amount: textCustomizationCost,
      });
    }

    if (imageCount > 0) {
      breakdown.push({
        label: `Logo Graphics (${imageCount} logo${imageCount > 1 ? 's' : ''})`,
        amount: imageCustomizationCost,
      });
    }

    return {
      currency: '₹',
      unitPrice,
      totalPrice,
      breakdown,
      isEstimate: false,
    };
  }
}

export const pricingService = new MockPricingService();

