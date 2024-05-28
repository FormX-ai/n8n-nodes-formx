/* eslint-disable n8n-nodes-base/node-param-display-name-miscased */
import {
	IDataObject,
	IDisplayOptions,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';
import { extractToWorkspace, getAsyncExtractionResult } from '../../../apis/client';
import { ExtractToWorkspaceAPIv2RequestHeaderData } from '../../../apis/schemas/extractToWorkspace';
import { retry } from '../../../utils/retry';
import { updateDisplayOptions } from '../../../utils/updateDisplayOptions';
import { commonProperties } from './commonProperties';

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
	const imageUrl = this.getNodeParameter('imageUrl', i, undefined, {
		extractValue: true,
	});
	const additionalFields = this.getNodeParameter('additionalFields', i, {}) as Record<string, any>;

	const response = await extractToWorkspace.call(this, {
		imageUrl: imageUrl,
		workspaceId: workspaceId,
		...additionalFields,
	} as ExtractToWorkspaceAPIv2RequestHeaderData);

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
