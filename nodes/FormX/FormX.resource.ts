import { INodeProperties } from 'n8n-workflow';

export const resources: INodeProperties[] = [
	{
		displayName: 'Resource',
		name: 'resource',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Extractor',
				value: 'extractor',
			},
			// TODO: Add workspace
		],
		default: 'extractor',
	},
];
