import React from 'react';
import { PRODUCTS } from '@/catalog/products';
import { useConfiguratorStore } from '@/core/state/useConfiguratorStore';
import { Check, Maximize2, MoveUp } from 'lucide-react';

export const ProductSelector: React.FC = () => {
  const selectedProductId = useConfiguratorStore((s) => s.selectedProductId);
  const setSelectedProduct = useConfiguratorStore((s) => s.setSelectedProduct);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Select Product Model
        </h3>
        <span className="text-[11px] text-slate-500">{PRODUCTS.length} Models Available</span>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {PRODUCTS.map((product) => {
          const isSelected = selectedProductId === product.id;

          return (
            <button
              key={product.id}
              onClick={() => setSelectedProduct(product.id)}
              className={`group relative flex flex-col text-left p-3.5 rounded-xl border transition-all ${
                isSelected
                  ? 'bg-blue-600/10 border-blue-500 shadow-md shadow-blue-500/10'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                      {product.sizeLabel}
                    </span>
                    <span className="text-xs font-medium text-slate-400">Canopy Tent</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{product.tagline}</p>
                </div>

                <div
                  className={`h-5 w-5 rounded-full flex items-center justify-center text-xs transition-all shrink-0 ml-2 ${
                    isSelected
                      ? 'bg-blue-600 text-white'
                      : 'border border-slate-700 text-transparent group-hover:border-slate-500'
                  }`}
                >
                  <Check className="h-3 w-3 stroke-[3]" />
                </div>
              </div>

              {/* Spec Pills */}
              <div className="flex items-center gap-3 mt-3 pt-2.5 border-t border-slate-800/60 text-[11px] text-slate-400">
                <div className="flex items-center gap-1">
                  <Maximize2 className="h-3 w-3 text-slate-500" />
                  <span>{product.dimensions.footprintAreaSqFt} sq ft</span>
                </div>
                <div className="flex items-center gap-1">
                  <MoveUp className="h-3 w-3 text-slate-500" />
                  <span>{product.dimensions.peakHeightFeet}' Peak</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
