import React, { useEffect, useState } from 'react';
import { useConfiguratorStore } from '@/core/state/useConfiguratorStore';
import { pricingService } from '@/features/pricing/pricingService';
import { PricingResponse } from '@/features/pricing/types';
import { buildShopifyCartPayload } from '@/features/shopify/shopifyAdapter';
import { shopifyService } from '@/features/shopify/shopifyService';
import { ShopifyCartPayload } from '@/features/shopify/types';
import { ShopifyCartModal } from '@/features/shopify/components/ShopifyCartModal';
import { PDFDownloadButton } from '@/features/pdf/components/PDFDownloadButton';
import { Minus, Plus, ShieldCheck, ShoppingCart, Loader2, Tag, ChevronRight } from 'lucide-react';

export const SpecSummary: React.FC = () => {
  const storeState = useConfiguratorStore();
  const activeProduct = storeState.getActiveProduct();
  const activeColor = storeState.getActiveCanopyColor();
  const activeFinish = storeState.getActiveFrameFinish();
  const quantity = storeState.quantity;
  const setQuantity = storeState.setQuantity;
  const selectedProductId = storeState.selectedProductId;
  const frameFinishId = storeState.frameFinishId;
  const canopyColorId = storeState.canopyColorId;
  const panelDesigns = storeState.panelDesigns;

  const [pricing, setPricing] = useState<PricingResponse | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [cartPayload, setCartPayload] = useState<ShopifyCartPayload | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | undefined>(undefined);

  // Fetch dynamic pricing asynchronously on state update
  useEffect(() => {
    let isSubscribed = true;
    setIsCalculating(true);

    pricingService
      .calculatePrice({
        productId: selectedProductId,
        frameFinishId: frameFinishId,
        canopyColorId: canopyColorId,
        quantity: quantity,
        panelDesigns: panelDesigns,
      })
      .then((res) => {
        if (isSubscribed) {
          setPricing(res);
          setIsCalculating(false);
        }
      })
      .catch((err) => {
        console.error('Pricing calculation failed:', err);
        if (isSubscribed) setIsCalculating(false);
      });

    return () => {
      isSubscribed = false;
    };
  }, [selectedProductId, frameFinishId, canopyColorId, quantity, panelDesigns]);

  // Handle Add to Shopify Cart Action
  const handleAddToCart = async () => {
    if (!pricing) return;
    setIsAddingToCart(true);

    try {
      const payload = buildShopifyCartPayload(storeState, pricing);
      const res = await shopifyService.createCheckoutPayload(payload.lineItems);

      setCartPayload(res.payload || payload);
      setCheckoutUrl(res.checkoutUrl);
      setCartModalOpen(true);
    } catch (err) {
      console.error('Failed to generate Shopify cart payload:', err);
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Product Spec Table */}
      <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-4 space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2 flex items-center justify-between">
          <span>Configuration Spec Sheet</span>
          <span className="text-[10px] text-blue-400 font-normal lowercase bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
            {activeProduct.sizeLabel}
          </span>
        </h4>

        <div className="space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Product Model</span>
            <span className="font-semibold text-white">{activeProduct.name}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Dimensions</span>
            <span className="font-medium text-slate-200">
              {activeProduct.dimensions.widthFeet}' x {activeProduct.dimensions.depthFeet}'
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Footprint Area</span>
            <span className="font-medium text-slate-200">
              {activeProduct.dimensions.footprintAreaSqFt} sq ft
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Frame Finish</span>
            <span className="font-medium text-slate-200">{activeFinish.name}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Canopy Color</span>
            <div className="flex items-center gap-1.5">
              <span
                className="h-3 w-3 rounded-full border border-slate-600 shadow-sm"
                style={{ backgroundColor: activeColor.colorHex }}
              />
              <span className="font-medium text-slate-200">{activeColor.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Pricing Breakdown Card */}
      <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Tag className="h-3.5 w-3.5 text-blue-400" />
            <span>Price Breakdown</span>
          </h4>

          {isCalculating && (
            <div className="flex items-center gap-1 text-[11px] text-blue-400">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Updating...</span>
            </div>
          )}
        </div>

        {pricing ? (
          <div className="space-y-2 text-xs">
            {pricing.breakdown.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">{item.label}</span>
                <span className="font-medium font-mono text-slate-200">
                  {pricing.currency}
                  {item.amount.toLocaleString('en-IN')}
                </span>
              </div>
            ))}

            <div className="border-t border-slate-800/80 pt-2 flex items-center justify-between text-slate-400">
              <span>Unit Price</span>
              <span className="font-semibold font-mono text-slate-200">
                {pricing.currency}
                {pricing.unitPrice.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="border-t border-slate-800 pt-2 flex items-baseline justify-between">
              <span className="font-semibold text-white">Total Price ({quantity} unit{quantity > 1 ? 's' : ''})</span>
              <div className="text-right">
                <span className="text-lg font-extrabold text-blue-400 font-mono">
                  {pricing.currency}
                  {pricing.totalPrice.toLocaleString('en-IN')}
                </span>
                <span className="block text-[10px] text-slate-500 font-medium">Excl. taxes & shipping</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-4 flex items-center justify-center text-xs text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin mr-2 text-blue-400" />
            Calculating pricing service estimate...
          </div>
        )}
      </div>

      {/* Quantity Selector */}
      <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-4 flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-white block">Order Quantity</span>
          <span className="text-[11px] text-slate-400">Bulk discount rates auto-apply</span>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 rounded-lg p-1 border border-slate-800">
          <button
            onClick={() => setQuantity(quantity - 1)}
            disabled={quantity <= 1}
            className="h-7 w-7 rounded flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 hover:bg-slate-800 transition-all"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="w-8 text-center text-xs font-bold text-white font-mono">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="h-7 w-7 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Add to Shopify Cart Main CTA Button */}
      <button
        onClick={handleAddToCart}
        disabled={isCalculating || isAddingToCart || !pricing}
        className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 active:scale-[0.99] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2.5 transition-all group"
      >
        {isAddingToCart ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-white" />
            <span>Building Shopify Payload...</span>
          </>
        ) : (
          <>
            <ShoppingCart className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span>Add to Shopify Cart</span>
            <ChevronRight className="h-4 w-4 opacity-70 group-hover:translate-x-0.5 transition-transform" />
          </>
        )}
      </button>

      {/* Dedicated Production PDF Download Button */}
      <PDFDownloadButton />

      {/* Synchronized Notice */}
      <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 pt-1">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
        <span>Live Shopify Cart Adapter Contract Active</span>
      </div>

      {/* Shopify Cart Payload Inspection Modal */}
      <ShopifyCartModal
        isOpen={cartModalOpen}
        onClose={() => setCartModalOpen(false)}
        payload={cartPayload}
        checkoutUrl={checkoutUrl}
      />
    </div>
  );
};

