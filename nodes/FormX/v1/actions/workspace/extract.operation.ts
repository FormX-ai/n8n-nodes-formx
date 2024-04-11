import type { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { updateDisplayOptions } from '../../../../utils/updateDisplayOptions';

const properties: INodeProperties[] = [];

const displayOptions = {
	show: {
		resource: ['workspace'],
		operation: ['extract'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
	// TODO: Implement /v2/workspace
	console.log('called execute for workspace - extract');
	const returnData: INodeExecutionData[] = [];
	return returnData;
}
