import { INodeProperties } from 'n8n-workflow';
import * as syncExtract from './syncExtract.operation';
import * as asyncExtract from './asyncExtract.operation';
import * as extractToWorkspace from './extractToWorkspace.operation';
import { extractAPIv2ResponseSchema } from '../../../apis/schemas/extractSync';
import { extractionResponseParserFactory } from '../../../apis/parse';
import { asyncExtractAPIv2ResponseSchema } from '../../../apis/schemas/extractAsync';
import { extractToWorksapceAPIv2ResponseSchema } from '../../../apis/schemas/extractToWorkspace';
import { pollAsyncResult } from '../../../apis/utils';

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
					output: {
						postReceive: [extractionResponseParserFactory(extractAPIv2ResponseSchema)],
					},
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
					output: {
						postReceive: [
							extractionResponseParserFactory(asyncExtractAPIv2ResponseSchema),
							pollAsyncResult,
						],
					},
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
					output: {
						postReceive: [
							extractionResponseParserFactory(extractToWorksapceAPIv2ResponseSchema),
							pollAsyncResult,
						],
					},
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
