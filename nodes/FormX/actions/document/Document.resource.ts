import { INodeProperties } from 'n8n-workflow';
import * as syncExtract from './syncExtract.operation';

export { syncExtract };

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Sync Extract',
				value: 'syncExtract',
				description: 'Extract document',
				action: 'Extract document',
			},
			// TODO: Add extractAsync
		],
		default: 'syncExtract',
		displayOptions: {
			show: {
				resource: ['document'],
			},
		},
	},
	...syncExtract.description,
];
