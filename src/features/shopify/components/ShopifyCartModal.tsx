import React, { useState } from 'react';
import { ShopifyCartPayload } from '../types';
import { ShoppingBag, CheckCircle2, Copy, Check, ExternalLink, X, Code, Sparkles } from 'lucide-react';

interface ShopifyCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  payload: ShopifyCartPayload | null;
  checkoutUrl?: string;
}

export const ShopifyCartModal: React.FC<ShopifyCartModalProps> = ({
  isOpen,
  onClose,
  payload,
  checkoutUrl,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'summary' | 'json'>('summary');

  if (!isOpen || !payload) return null;

  const lineItem = payload.lineItems[0];
  const jsonString = JSON.stringify(payload, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Shopify Cart Payload Generated</h3>
                <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="h-3 w-3" /> Ready
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Configuration state converted into structured Shopify Cart Payload
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 gap-2 pt-2">
          <button
            onClick={() => setActiveTab('summary')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-semibold transition-all border-t border-x ${
              activeTab === 'summary'
                ? 'bg-slate-900 text-blue-400 border-slate-800 border-b-slate-900 -mb-px'
                : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Structured Properties
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-semibold transition-all border-t border-x ${
              activeTab === 'json'
                ? 'bg-slate-900 text-blue-400 border-slate-800 border-b-slate-900 -mb-px'
                : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Code className="h-3.5 w-3.5" />
            Raw JSON Payload
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeTab === 'summary' ? (
            <div className="space-y-4">
              {/* Variant Details */}
              <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-4 space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                  <span className="text-slate-400 font-medium">Shopify Variant ID</span>
                  <span className="font-mono text-emerald-400 text-[11px] font-semibold bg-emerald-950/40 px-2.5 py-1 rounded border border-emerald-900/50">
                    {lineItem?.variantId}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Quantity</span>
                  <span className="font-bold text-white text-sm">{lineItem?.quantity} unit(s)</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Subtotal</span>
                  <span className="font-extrabold text-blue-400 text-base">{payload.subtotalPrice}</span>
                </div>
              </div>

              {/* Line Item Attributes Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Line Item Custom Attributes
                </h4>
                <div className="rounded-xl bg-slate-950/80 border border-slate-800 divide-y divide-slate-800/60 overflow-hidden text-xs">
                  {lineItem?.customAttributes.map((attr, idx) => (
                    <div key={idx} className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-900/50 transition-colors">
                      <span className="text-slate-400 font-medium">{attr.key}</span>
                      <span className="font-semibold text-slate-100 text-right max-w-[60%] truncate">
                        {attr.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={handleCopy}
                className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 shadow-md transition-all"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy JSON</span>
                  </>
                )}
              </button>
              <pre className="rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-[11px] text-emerald-300/90 overflow-x-auto leading-relaxed">
                {jsonString}
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/80">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            Continue Customizing
          </button>

          {checkoutUrl && (
            <a
              href={checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all transform hover:-translate-y-0.5"
            >
              <span>Simulate Checkout</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
