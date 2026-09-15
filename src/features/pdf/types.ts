export interface PDFExportOptions {
  include3DPreview: boolean;
  includeSpecSheet: boolean;
}

export interface IPDFService {
  generateProductionSummary(options: PDFExportOptions): Promise<Blob>;
}
