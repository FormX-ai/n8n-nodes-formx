import { IDisplayOptions, INodeProperties } from 'n8n-workflow';
import { updateDisplayOptions } from '../../../utils/updateDisplayOptions';
import { commonProperties } from './commonProperties';

const properties: INodeProperties[] = [
	{
		displayName: 'File Name',
		name: 'fileName',
		type: 'string',
		default: '',
		placeholder: '',
		routing: {
			request: {
				headers: {
					'X-WORKER-WORKSPACE-FILE-NAME': '={{$value}}',
				},
			},
		},
	},
	...commonProperties(),
];

const displayOptions: IDisplayOptions = {
	show: {
		resource: ['document'],
		operation: ['extractToWorkspace'],
	},
};
export const description = updateDisplayOptions(displayOptions, properties);
