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
				description: 'Document extraction via workspace',
				action: 'Extract via workspace',
			},
		],
		default: 'extract',
		displayOptions: {
			show: {
				resource: ['workspace'],
			},
		},
	},
	...extract.description,
];
