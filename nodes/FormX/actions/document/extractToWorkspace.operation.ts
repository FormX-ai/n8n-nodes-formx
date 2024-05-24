/* eslint-disable n8n-nodes-base/node-param-display-name-miscased */
import {
	IDataObject,
	IDisplayOptions,
	IExecuteFunctions,
	IHttpRequestOptions,
	IN8nHttpFullResponse,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';
import { retry } from '../../../utils/retry';
import { updateDisplayOptions } from '../../../utils/updateDisplayOptions';

const operations: INodeProperties[] = [
	{
		displayName: 'Workspace ID',
		name: 'workspaceId',
		type: 'string',
		default: '',
		placeholder: '',
	},
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
				displayName: 'File name',
				name: 'fileName',
				type: 'string',
				default: '',
				placeholder: '',
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

const displayOptions: IDisplayOptions = {
	show: {
		resource: ['document'],
		operation: ['extractToWorkspace'],
	},
};
export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	const workspaceId = this.getNodeParameter('workspaceId', i, undefined, {
		extractValue: true,
	});
	const imageUrl = this.getNodeParameter('imageUrl', i, undefined, {
		extractValue: true,
	});
	const additionalFields = this.getNodeParameter('additionalFields', i, {}) as Record<string, any>;

	const requestOptions: IHttpRequestOptions = {
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			'X-WORKER-WORKSPACE-ID': workspaceId,
			'X-WORKER-ENCODING': 'raw',
			'X-WORKER-IMAGE-URL': imageUrl,
			'X-WORKER-PDF-DPI': '150',
			'X-WORKER-WORKSPACE-FILE-NAME': additionalFields?.['fileName'],
			'X-WORKER-PROCESSING-MODE': additionalFields?.['processingMode'] ?? 'per-page',
			'X-WORKER-AUTO-ADJUST-IMAGE-SIZE': additionalFields?.['autoAdjustImageSize'] ?? true,
			'X-WORKER-OCR-ENGINE': additionalFields?.['ocrEngine'] ?? '',
		},
		method: 'POST',
		url: `https://worker.formextractorai.com/v2/workspace`,
	};

	const response = (await this.helpers.httpRequestWithAuthentication.call(
		this,
		'formXApi',
		requestOptions,
	)) as IDataObject;

	const jobId = response.job_id;
	let getResultResponse: IN8nHttpFullResponse | null = null;

	// Polling to get result until it's ready / timeout
	const result = await retry(
		async () => {
			const requestOptions: IHttpRequestOptions = {
				headers: {
					Accept: 'application/json',
				},
				method: 'GET',
				url: `https://worker.formextractorai.com/v2/extract/jobs/${jobId}`,
				returnFullResponse: true,
			};
			getResultResponse = (await this.helpers.httpRequestWithAuthentication.call(
				this,
				'formXApi',
				requestOptions,
			)) as IN8nHttpFullResponse;
			if (getResultResponse.statusCode !== 201) {
				return getResultResponse.body;
			} else {
				throw Error('Extraction result not ready');
			}
		},
		{ retries: 30, retryIntervalMs: 1000 },
	);

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(result as IDataObject[]),
		{ itemData: { item: i } },
	);

	return executionData;
}
