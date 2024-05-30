export type ProcessingMode = 'per-page' | 'per-file' | 'multiple-documents-per-page';

export type OCREngine = 'google' | 'azure' | 'tesseract';

export type ExtractAPIv2RequestHeaderData = {
	imageUrl: string;
	processingMode?: ProcessingMode;
	autoAdjustImageSize?: boolean;
	ocrEngine?: OCREngine;
	pdfPdi?: string;
};
