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
