import React, { useState } from 'react';
import { useConfiguratorStore } from '@/core/state/useConfiguratorStore';
import { pricingService } from '@/features/pricing/pricingService';
import { buildShopifyCartPayload } from '@/features/shopify/shopifyAdapter';
import { capturePreviews } from '../previewGenerator';
import { pdfService } from '../pdfService';
import { FileText, Loader2, Download, AlertCircle } from 'lucide-react';

export const PDFDownloadButton: React.FC = () => {
  const storeState = useConfiguratorStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    setErrorMsg(null);

    try {
      // 1. Calculate current pricing
      const pricing = await pricingService.calculatePrice({
        productId: storeState.selectedProductId,
        frameFinishId: storeState.frameFinishId,
        canopyColorId: storeState.canopyColorId,
        quantity: storeState.quantity,
        panelDesigns: storeState.panelDesigns,
      });

      // 2. Generate Shopify Payload
      const shopifyData = buildShopifyCartPayload(storeState, pricing);

      // 3. Capture 2D & 3D Previews
      const previews = await capturePreviews(storeState);

      // 4. Build Production Summary Data
      const summaryData = pdfService.buildProductionSummaryData(
        storeState,
        pricing,
        shopifyData,
        previews
      );

      // 5. Generate PDF Blob
      const pdfBlob = await pdfService.generatePDF(summaryData);

      // 6. Trigger Browser Download
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `canopy-studio-${summaryData.configurationId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to generate PDF summary:', err);
      setErrorMsg('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-1.5 w-full">
      <button
        onClick={handleDownloadPDF}
        disabled={isGenerating}
        className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-[0.99] border border-slate-700 disabled:opacity-50 text-slate-100 font-semibold text-xs shadow-md flex items-center justify-center gap-2 transition-all group"
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
            <span className="text-slate-200">Generating Production PDF...</span>
          </>
        ) : (
          <>
            <FileText className="h-4 w-4 text-blue-400 group-hover:scale-110 transition-transform" />
            <span>Download Configuration PDF</span>
            <Download className="h-3.5 w-3.5 ml-auto text-slate-400 group-hover:text-white transition-colors" />
          </>
        )}
      </button>

      {errorMsg && (
        <div className="flex items-center gap-1.5 text-[11px] text-rose-400 px-1">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
