import { IPricingService, PricingRequestPayload, PricingResponse } from './types';

/**
 * Baseline Pricing Service Contract.
 * In future phases, this will connect to the dynamic pricing API.
 * Phase 1 maintains the service interface without hardcoded UI pricing rules.
 */
export class PricingService implements IPricingService {
  async calculatePrice(_payload: PricingRequestPayload): Promise<PricingResponse> {
    // API endpoint call will be wired in later pricing phase.
    throw new Error('Pricing API service is scheduled for integration in Phase 4.');
  }
}

export const pricingService = new PricingService();
