/* eslint-disable n8n-nodes-base/node-param-display-name-miscased */
import {
	IDisplayOptions,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';
import { asyncExtract, getAsyncExtractionResult } from '../../../apis/client';
import { shouldRetryOnError } from '../../../apis/parse';
import { ExtractAPIv2RequestData } from '../../../apis/schemas/extract';
import { retry } from '../../../utils/retry';
import { updateDisplayOptions } from '../../../utils/updateDisplayOptions';
import { commonProperties } from './commonProperties';
import { getBinaryDataFromField } from '../../../utils/getBinaryData';

const properties: INodeProperties[] = [...commonProperties()];

const displayOptions: IDisplayOptions = {
	show: {
		resource: ['document'],
		operation: ['asyncExtract'],
	},
};
export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	const dataBuffer = await getBinaryDataFromField.call(this, i, 'binaryDataField');
	const additionalFields = this.getNodeParameter('additionalFields', i, {}) as Record<string, any>;

	let error: unknown;
	const response = await retry(
		async () => {
			try {
				return await asyncExtract.call(this, {
					dataBuffer: dataBuffer,
					...additionalFields,
				} as ExtractAPIv2RequestData);
			} catch (err) {
				error = err;
				throw err;
			}
		},
		{ retries: 5, retryIntervalMs: 5000 },
		() => shouldRetryOnError(error),
	);

	const jobId = response.job_id;

	// Polling to get result until it's ready / timeout
	const result = await retry(
		async () => {
			const response = await getAsyncExtractionResult.call(this, jobId);
			if (response.status === 'ok') {
				return response;
			} else {
				throw Error('Extraction result not ready');
			}
		},
		{ retries: 30, retryIntervalMs: 1000 },
	);

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(result),
		{ itemData: { item: i } },
	);

	return executionData;
}
