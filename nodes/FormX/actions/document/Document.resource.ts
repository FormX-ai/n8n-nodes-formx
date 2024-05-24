import { INodeProperties } from 'n8n-workflow';
import * as syncExtract from './syncExtract.operation';
import * as asyncExtract from './asyncExtract.operation';

export { syncExtract, asyncExtract };

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
			{
				name: 'Async Extract',
				value: 'asyncExtract',
				description: 'Async Extract document',
				action: 'Async extract document',
			},
		],
		default: 'syncExtract',
		displayOptions: {
			show: {
				resource: ['document'],
			},
		},
	},
	...syncExtract.description,
	...asyncExtract.description,
];
