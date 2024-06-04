import { IDisplayOptions, INodeProperties } from 'n8n-workflow';
import { updateDisplayOptions } from '../../../utils/updateDisplayOptions';

const properties: INodeProperties[] = [
	{
		displayName: 'Job ID',
		name: 'jobId',
		type: 'string',
		default: '',
		placeholder: '',
		routing: {
			request: {
				method: 'GET',
				url: '=/v2/extract/jobs/{{$value}}',
			},
		},
	},
];

const getAsyncResultDisplayOptions: IDisplayOptions = {
	show: {
		resource: ['document'],
		operation: ['getAsyncResult'],
	},
};
export const description = updateDisplayOptions(getAsyncResultDisplayOptions, properties);
