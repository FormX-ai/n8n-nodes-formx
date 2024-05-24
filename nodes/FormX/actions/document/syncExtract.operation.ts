/* eslint-disable n8n-nodes-base/node-param-display-name-miscased */
import {
	IDataObject,
	IDisplayOptions,
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';
import { updateDisplayOptions } from '../../../utils/updateDisplayOptions';

const operations: INodeProperties[] = [
	{
		displayName: 'Image URL',
		name: 'imageUrl',
		type: 'string',
		default: '',
		placeholder: 'https://formextractorai.com/sample-invoice-1.d551279a.jpg',
	},
];

const additionalFields: INodeProperties[] = [
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		default: {},
		placeholder: 'Add Field',
		options: [
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
						name: 'google',
						value: 'google',
					},
					{
						name: 'azure',
						value: 'azure',
					},
					{
						name: 'tesseract',
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
		],
	},
];

const properties: INodeProperties[] = [...operations, ...additionalFields];

const syncDisplayOptions: IDisplayOptions = {
	show: {
		resource: ['document'],
		operation: ['syncExtract'],
	},
};
export const description = updateDisplayOptions(syncDisplayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	const imageUrl = this.getNodeParameter('imageUrl', i, undefined, {
		extractValue: true,
	});
	const additionalFields = this.getNodeParameter('additionalFields', i, {}) as Record<string, any>;

	const requestOptions: IHttpRequestOptions = {
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			'X-WORKER-ASYNC': 'false',
			'X-WORKER-ENCODING': 'raw',
			'X-WORKER-IMAGE-URL': imageUrl,
			'X-WORKER-PDF-DPI': '150',
			'X-WORKER-PROCESSING-MODE': additionalFields?.['processingMode'] ?? 'per-page',
			'X-WORKER-AUTO-ADJUST-IMAGE-SIZE': additionalFields?.['autoAdjustImageSize'] ?? true,
			'X-WORKER-OCR-ENGINE': additionalFields?.['ocrEngine'] ?? '',
		},
		method: 'POST',
		url: `https://worker.formextractorai.com/v2/extract`,
	};
	const response = await this.helpers.httpRequestWithAuthentication.call(
		this,
		'formXApi',
		requestOptions,
	);
	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(response as IDataObject[]),
		{ itemData: { item: i } },
	);

	return executionData;
}
