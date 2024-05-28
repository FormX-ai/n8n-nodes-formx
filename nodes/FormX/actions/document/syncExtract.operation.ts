/* eslint-disable n8n-nodes-base/node-param-display-name-miscased */
import {
	IDataObject,
	IDisplayOptions,
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';
import { config } from '../../../config';
import { updateDisplayOptions } from '../../../utils/updateDisplayOptions';
import { commonProperties } from './commonProperties';

const properties: INodeProperties[] = [...commonProperties()];

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
		url: `${config.formxWorkerBaseUrl}/v2/extract`,
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
