import { IDisplayOptions, INodeProperties } from 'n8n-workflow';
import { updateDisplayOptions } from '../../../utils/updateDisplayOptions';

const operations: INodeProperties[] = [
	{
		displayName: 'Image URL',
		name: 'imageUrl',
		type: 'string',
		routing: {
			request: {
				headers: {
					'X-WORKER-IMAGE-URL': '={{$value}}',
				},
			},
		},
		default: '',
		placeholder: 'https://formextractorai.com/sample-invoice-1.d551279a.jpg',
	},
];

const additionalFields: INodeProperties[] = [
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		default: {},
		placeholder: 'Add Field',
		options: [
			// TODO: Add other api fields
		],
	},
];

const properties: INodeProperties[] = [...operations, ...additionalFields];

const displayOptions: IDisplayOptions = {
	show: {
		resource: ['extractor'],
		operations: ['extractSync'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);
