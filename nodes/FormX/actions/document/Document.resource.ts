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
				routing: {
					request: {
						method: 'POST',
						url: '/v2/extract',
						headers: {
							'X-WORKER-ASYNC': 'false',
							'X-WORKER-ENCODING': 'raw',
							// default headers to be overridden by optional fields
							'X-WORKER-AUTO-ADJUST-IMAGE-SIZE': 'true',
							'X-WORKER-PDF-DPI': '150',
							'X-WORKER-PROCESSING-MODE': 'per-page',
						},
					},
				},
			},
			{
				name: 'Async Extract',
				value: 'asyncExtract',
				description: 'Async Extract document',
				action: 'Async extract document',
				routing: {
					request: {
						method: 'POST',
						url: '/v2/extract',
						headers: {
							'X-WORKER-ASYNC': 'true',
							'X-WORKER-ENCODING': 'raw',
							// default headers to be overridden by optional fields
							'X-WORKER-AUTO-ADJUST-IMAGE-SIZE': 'true',
							'X-WORKER-PDF-DPI': '150',
							'X-WORKER-PROCESSING-MODE': 'per-page',
						},
					},
				},
			},
			{
				name: 'Extract to Workspace',
				value: 'extractToWorkspace',
				description: 'Extract document to workspace',
				action: 'Extract document to workspace',
				routing: {
					request: {
						method: 'POST',
						url: '/v2/extract',
						headers: {
							'X-WORKER-ENCODING': 'raw',
							// default headers to be overridden by optional fields
							'X-WORKER-AUTO-ADJUST-IMAGE-SIZE': 'true',
							'X-WORKER-PDF-DPI': '150',
							'X-WORKER-PROCESSING-MODE': 'per-page',
						},
					},
				},
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
