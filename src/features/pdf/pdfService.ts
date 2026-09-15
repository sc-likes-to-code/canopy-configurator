import { IPDFService, PDFExportOptions } from './types';

export class PDFService implements IPDFService {
  async generateProductionSummary(_options: PDFExportOptions): Promise<Blob> {
    throw new Error('PDF Generation service is scheduled for Phase 5.');
  }
}

export const pdfService = new PDFService();
