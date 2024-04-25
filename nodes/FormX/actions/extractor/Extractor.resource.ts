import { IDisplayOptions, INodeProperties } from 'n8n-workflow';
import * as extractSync from './extractSync.operation';
import { updateDisplayOptions } from '../../../utils/updateDisplayOptions';

export { extractSync };

const properties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Extract',
				value: 'extractSync',
				description: 'Extract document via Extractor',
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
		default: 'extractSync',
	},
	...extractSync.description,
];

const displayOptions: IDisplayOptions = {
	show: {
		resource: ['extractor'],
	},
};

export const description: INodeProperties[] = updateDisplayOptions(displayOptions, properties);
