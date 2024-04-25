import { INodeProperties, INodeType, INodeTypeDescription } from 'n8n-workflow';

const nodeDescription: Omit<INodeTypeDescription, 'properties'> = {
	displayName: 'FormX',
	name: 'FormX',
	// TODO: Ask for clearer official formx.svg
	// eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
	icon: 'file:formx.png',
	group: ['transform'],
	version: 1,
	subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
	description: 'Extract data from FormX API',
	defaults: {
		name: 'FormX',
	},
	inputs: ['main'],
	outputs: ['main'],
	credentials: [
		{
			name: 'formXApi', // must be same name as `../credentials/FormXAPi.credentials.ts` > `FormXAPi.name`
			required: true,
		},
	],
	// ref https://help.formx.ai/reference/document-extraction
	requestDefaults: {
		baseURL: 'https://worker.formextractorai.com',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'image/*',
		},
	},
};

const resources: INodeProperties[] = [
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

const operations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['extractor'],
			},
		},
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
						},
					},
				},
			},
			// TODO: Add extractAsync
		],
		default: 'extractSync',
	},
	{
		displayName: 'Image URL',
		name: 'imageUrl',
		type: 'string',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['extractor'],
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
export class FormX implements INodeType {
	description: INodeTypeDescription = {
		...nodeDescription,
		properties: [...resources, ...operations, ...additionalFields],
	};
}
