export interface ShopifyCartCustomAttribute {
  key: string;
  value: string;
}

export interface ShopifyCartLineItem {
  variantId: string;
  quantity: number;
  customAttributes: ShopifyCartCustomAttribute[];
}

export interface ShopifyCartPayload {
  lineItems: ShopifyCartLineItem[];
  subtotalPrice: string;
  currency: string;
  createdAt: string;
}

export interface IShopifyService {
  createCheckoutPayload(cartItems: ShopifyCartLineItem[]): Promise<{ checkoutUrl?: string; payload: ShopifyCartPayload }>;
}

