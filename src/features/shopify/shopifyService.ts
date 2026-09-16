import { IShopifyService, ShopifyCartLineItem, ShopifyCartPayload } from './types';

export class MockShopifyService implements IShopifyService {
  async createCheckoutPayload(cartItems: ShopifyCartLineItem[]): Promise<{ checkoutUrl?: string; payload: ShopifyCartPayload }> {
    // Simulate API network latency (100ms)
    await new Promise((resolve) => setTimeout(resolve, 100));

    const totalAmount = cartItems.reduce((acc, item) => {
      const priceAttr = item.customAttributes.find((a) => a.key === 'Subtotal Price');
      const val = priceAttr ? parseFloat(priceAttr.value.replace(/[^0-9.]/g, '')) : 0;
      return acc + (val || 0);
    }, 0);

    const payload: ShopifyCartPayload = {
      lineItems: cartItems,
      subtotalPrice: `₹${totalAmount.toLocaleString('en-IN')}`,
      currency: '₹',
      createdAt: new Date().toISOString(),
    };

    return {
      checkoutUrl: `https://checkout.shopify.com/store/canopy-studio/cart?token=mock_checkout_${Date.now()}`,
      payload,
    };
  }
}

export const shopifyService = new MockShopifyService();

