/* eslint-disable n8n-nodes-base/node-param-display-name-miscased */
import {
	IDataObject,
	IDisplayOptions,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';
import { syncExtract } from '../../../apis/client';
import { shouldRetryOnError } from '../../../apis/parse';
import { ExtractAPIv2RequestData } from '../../../apis/schemas/extract';
import { retry } from '../../../utils/retry';
import { updateDisplayOptions } from '../../../utils/updateDisplayOptions';
import { commonProperties } from './commonProperties';
import { getBinaryDataFromField } from '../../../utils/getBinaryData';

const properties: INodeProperties[] = [...commonProperties()];

const syncDisplayOptions: IDisplayOptions = {
	show: {
		resource: ['document'],
		operation: ['syncExtract'],
	},
};
export const description = updateDisplayOptions(syncDisplayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	const dataBuffer = await getBinaryDataFromField.call(this, i, 'binaryDataField');

	const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;

	let error: unknown;
	const response = await retry(
		async () => {
			try {
				return await syncExtract.call(this, {
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
	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(response),
		{ itemData: { item: i } },
	);

	return executionData;
}
