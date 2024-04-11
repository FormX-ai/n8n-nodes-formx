import { INodeProperties } from 'n8n-workflow';
import * as extract from './extract.operation';

export { extract };

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Extract',
				value: 'extract',
				description: 'Document extraction via extractor',
				action: 'Extract via extractor',
			},
		],
		default: 'extract',
		displayOptions: {
			show: {
				resource: ['extractor'],
			},
		},
	},
	...extract.description,
];
