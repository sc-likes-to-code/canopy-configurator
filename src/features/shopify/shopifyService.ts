import { IShopifyService, ShopifyCartLineItem, ShopifyCartPayload } from './types';

export class MockShopifyService implements IShopifyService {
  async createCheckoutPayload(cartItems: ShopifyCartLineItem[]): Promise<{ checkoutUrl?: string; payload: ShopifyCartPayload }> {
    // Simulate API network latency (100ms)
    await new Promise((resolve) => setTimeout(resolve, 100));

    const subtotalAttr = cartItems[0]?.customAttributes.find((a) => a.key === 'Subtotal Price');
    const subtotalPrice = subtotalAttr ? subtotalAttr.value : 'Rs. 0';

    const payload: ShopifyCartPayload = {
      lineItems: cartItems,
      subtotalPrice,
      currency: 'Rs. ',
      createdAt: new Date().toISOString(),
    };

    return {
      checkoutUrl: `https://checkout.shopify.com/store/canopy-studio/cart?token=mock_checkout_${Date.now()}`,
      payload,
    };
  }
}

export const shopifyService = new MockShopifyService();

