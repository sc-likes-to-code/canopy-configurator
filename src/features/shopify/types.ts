export interface ShopifyCartLineItem {
  variantId: string;
  quantity: number;
  customAttributes: { key: string; value: string }[];
}

export interface IShopifyService {
  createCheckoutPayload(cartItems: ShopifyCartLineItem[]): Promise<{ checkoutUrl?: string }>;
}
