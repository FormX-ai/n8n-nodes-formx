import {
	IExecuteSingleFunctions,
	IHttpRequestOptions,
	INodeProperties,
	NodeOperationError,
} from 'n8n-workflow';

export async function getImageBinaryData(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	try {
		const binaryDataField = this.getNodeParameter('binaryDataField');

		let dataBuffer: Buffer | null = null;
		if (binaryDataField && this.helpers.assertBinaryData(binaryDataField)) {
			dataBuffer = await this.helpers.getBinaryDataBuffer(binaryDataField);
		}
		requestOptions.body = dataBuffer;

		return requestOptions;
	} catch (err) {
		throw new NodeOperationError(this.getNode(), err as Error);
	}
}

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
		routing: {
			send: {
				preSend: [getImageBinaryData],
			},
			request: {
				headers: {
					'Content-Type': 'image/*',
				},
			},
		},
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
				routing: {
					request: {
						headers: {
							'Content-Type': 'application/json',
							'X-WORKER-IMAGE-URL': '={{$value}}',
						},
					},
				},
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
				routing: {
					request: {
						headers: {
							'X-WORKER-PROCESSING-MODE': '={{$value}}',
						},
					},
				},
			},
			{
				displayName: 'Auto Adjust Image Size',
				name: 'autoAdjustImageSize',
				type: 'boolean',
				default: true,
				routing: {
					request: {
						headers: {
							'X-WORKER-AUTO-ADJUST-IMAGE-SIZE': '={{$value}}',
						},
					},
				},
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
				routing: {
					request: {
						headers: {
							'X-WORKER-OCR-ENGINE': '={{$value}}',
						},
					},
				},
			},
			{
				displayName: 'PDF DPI',
				name: 'pdfDpi',
				type: 'number',
				default: 150,
				routing: {
					request: {
						headers: {
							'X-WORKER-PDF-DPI': '={{$value}}',
						},
					},
				},
			},
			...extraAdditionalFields,
		],
	},
];
