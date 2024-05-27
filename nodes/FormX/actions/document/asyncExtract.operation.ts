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
import { commonProperties } from './commonProperties';

const properties: INodeProperties[] = [...commonProperties()];

const displayOptions: IDisplayOptions = {
	show: {
		resource: ['document'],
		operation: ['asyncExtract'],
	},
};
export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	const imageUrl = this.getNodeParameter('imageUrl', i, undefined, {
		extractValue: true,
	});
	const additionalFields = this.getNodeParameter('additionalFields', i, {}) as Record<string, any>;

	const requestOptions: IHttpRequestOptions = {
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			'X-WORKER-ASYNC': 'true',
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
