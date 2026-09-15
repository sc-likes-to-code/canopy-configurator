import { IShopifyService, ShopifyCartLineItem } from './types';

export class ShopifyService implements IShopifyService {
  async createCheckoutPayload(_cartItems: ShopifyCartLineItem[]): Promise<{ checkoutUrl?: string }> {
    throw new Error('Shopify integration is scheduled for Phase 5.');
  }
}

export const shopifyService = new ShopifyService();
