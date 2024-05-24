import { INodeProperties } from 'n8n-workflow';
import * as syncExtract from './syncExtract.operation';
import * as asyncExtract from './asyncExtract.operation';
import * as extractToWorkspace from './extractToWorkspace.operation';

export { syncExtract, asyncExtract, extractToWorkspace };

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
			{
				name: 'Extract to Workspace',
				value: 'extractToWorkspace',
				description: 'Extract document to workspace',
				action: 'Extract document to workspace',
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
	...extractToWorkspace.description,
];
