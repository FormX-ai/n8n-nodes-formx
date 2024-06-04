/* eslint-disable n8n-nodes-base/node-param-display-name-miscased */
import {
	IDataObject,
	IDisplayOptions,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';
import { extractToWorkspace, getAsyncExtractionResult } from '../../../apis/client';
import { shouldRetryOnError } from '../../../apis/parse';
import { ExtractToWorkspaceAPIv2RequestData } from '../../../apis/schemas/extractToWorkspace';
import { retry } from '../../../utils/retry';
import { updateDisplayOptions } from '../../../utils/updateDisplayOptions';
import { commonProperties } from './commonProperties';
import { getBinaryDataFromField } from '../../../utils/getBinaryData';

const properties: INodeProperties[] = [
	{
		displayName: 'Workspace ID',
		name: 'workspaceId',
		type: 'string',
		default: '',
		placeholder: '',
	},
	...commonProperties([
		{
			displayName: 'File name',
			name: 'fileName',
			type: 'string',
			default: '',
			placeholder: '',
		},
	]),
];

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
	const additionalFields = this.getNodeParameter('additionalFields', i, {}) as Record<string, any>;
	const dataBuffer = await getBinaryDataFromField.call(this, i, 'binaryDataField');

	let error: unknown;
	const response = await retry(
		async () => {
			try {
				return await extractToWorkspace.call(this, {
					dataBuffer: dataBuffer,
					workspaceId: workspaceId,
					...additionalFields,
				} as ExtractToWorkspaceAPIv2RequestData);
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
