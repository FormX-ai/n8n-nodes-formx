import { INodeProperties } from 'n8n-workflow';
import * as document from './document/Document.resource';

export const actionProperties: INodeProperties[] = [
	{
		displayName: 'Resource',
		name: 'resource',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Document',
				value: 'document',
			},
		],
		default: 'document',
	},
	...document.description,
];
