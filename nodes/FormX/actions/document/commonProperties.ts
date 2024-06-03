import { INodeProperties } from 'n8n-workflow';

export const commonProperties = (
	extraAdditionalFields: INodeProperties[] = [],
): INodeProperties[] => [
	{
		displayName: 'Binary Data Field',
		name: 'binaryDataField',
		type: 'string',
		default: 'data',
		hint: 'The name of the input field containing the binary file data to be processed',
		placeholder: 'e.g. data',
		description: 'Name of the binary property which contains the file',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		default: {},
		placeholder: 'Add Field',
		options: [
			{
				displayName: 'Image URL',
				name: 'imageUrl',
				type: 'string',
				default: '',
				placeholder: 'https://formextractorai.com/sample-invoice-1.d551279a.jpg',
			},
			{
				displayName: 'Processing Mode',
				name: 'processingMode',
				type: 'options',
				options: [
					{
						name: 'per-page',
						value: 'per-page',
					},
					{
						name: 'per-file',
						value: 'per-file',
					},
					{
						name: 'multiple-documents-per-page',
						value: 'multiple-documents-per-page',
					},
				],
				default: 'per-page',
			},
			{
				displayName: 'Auto Adjust Image Size',
				name: 'autoAdjustImageSize',
				type: 'boolean',
				default: true,
			},
			{
				displayName: 'Specify OCR Engine',
				name: 'ocrEngine',
				type: 'options',
				options: [
					{
						name: '', // FIXME: investigate on nullable option
						value: '',
					},
					{
						name: 'Google',
						value: 'google',
					},
					{
						name: 'Azure',
						value: 'azure',
					},
					{
						name: 'Tesseract',
						value: 'tesseract',
					},
				],
				default: '',
			},
			{
				displayName: 'PDF DPI',
				name: 'pdfDpi',
				type: 'number',
				default: 150,
			},
			...extraAdditionalFields,
		],
	},
];
