import { ConfiguratorState } from '@/core/state/types';
import { PricingResponse } from '@/features/pricing/types';
import { ShopifyCartPayload, ShopifyCartLineItem, ShopifyCartCustomAttribute } from './types';

/**
 * Transforms client configurator state & calculated pricing response into a
 * clean, fully serializable Shopify Cart payload ready for cart API / checkout.
 */
export function buildShopifyCartPayload(
  state: ConfiguratorState,
  pricing: PricingResponse
): ShopifyCartPayload {
  const activeProduct = state.getActiveProduct();
  const activeColor = state.getActiveCanopyColor();
  const activeFinish = state.getActiveFrameFinish();

  // Inspect active customized panels
  const customizedPanels: string[] = [];
  let totalTextCount = 0;
  let totalImageCount = 0;

  Object.entries(state.panelDesigns).forEach(([panelId, design]) => {
    if (design?.elements && design.elements.length > 0) {
      const panelDef = activeProduct.panels.find((p) => p.id === panelId);
      if (panelDef) {
        customizedPanels.push(panelDef.label);
      }
      design.elements.forEach((el) => {
        if (el.type === 'text') totalTextCount++;
        if (el.type === 'image') totalImageCount++;
      });
    }
  });

  const customAttributes: ShopifyCartCustomAttribute[] = [
    { key: 'Product Model', value: `${activeProduct.name} (${activeProduct.sizeLabel})` },
    { key: 'Dimensions', value: `${activeProduct.dimensions.widthFeet}' x ${activeProduct.dimensions.depthFeet}'` },
    { key: 'Canopy Color', value: `${activeColor.name} (${activeColor.colorHex})` },
    { key: 'Frame Finish', value: activeFinish.name },
    { key: 'Customized Panels', value: customizedPanels.length > 0 ? customizedPanels.join(', ') : 'None (Standard Solid)' },
    { key: 'Text Elements Count', value: String(totalTextCount) },
    { key: 'Logo Elements Count', value: String(totalImageCount) },
    { key: 'Unit Price', value: `${pricing.currency}${pricing.unitPrice.toLocaleString('en-IN')}` },
    { key: 'Subtotal Price', value: `${pricing.currency}${pricing.totalPrice.toLocaleString('en-IN')}` },
  ];

  // Add individual breakdown lines as custom attributes
  pricing.breakdown.forEach((item, index) => {
    customAttributes.push({
      key: `Price Line #${index + 1}`,
      value: `${item.label}: ${pricing.currency}${item.amount.toLocaleString('en-IN')}`,
    });
  });

  const lineItem: ShopifyCartLineItem = {
    variantId: `gid://shopify/ProductVariant/${activeProduct.id}-${activeFinish.id}-${activeColor.id}`,
    quantity: state.quantity,
    customAttributes,
  };

  return {
    lineItems: [lineItem],
    subtotalPrice: `${pricing.currency}${pricing.totalPrice.toLocaleString('en-IN')}`,
    currency: pricing.currency,
    createdAt: new Date().toISOString(),
  };
}
