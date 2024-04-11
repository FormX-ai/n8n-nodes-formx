import { INodeType, INodeTypeDescription } from 'n8n-workflow';

export class FormX implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'FormX',
		name: 'FormX',
		// TODO: Ask for clearer official formx.svg
		// eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
		icon: 'file:formx.png',
		group: ['transform'],
		version: 1,
		subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
		description: 'Extract image/pdf data from FormX API',
		defaults: {
			name: 'FormX',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'formXApi',
				required: true,
				displayOptions: {
					show: {
						authentication: ['accessToken'],
					},
				},
			},
		],
		requestDefaults: {
			baseURL: 'https://worker.formextractorai.com',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'image/*',
			},
		},
		properties: [
			{
				displayName: 'Authentication',
				name: 'authentication',
				type: 'options',
				options: [
					{
						name: 'Access Token',
						value: 'accessToken',
					},
				],
				default: 'accessToken',
			},
			{
				displayName: 'Extractor Type',
				name: 'extractor type',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Via Extractor',
						value: 'viaExtractor',
						description: 'Document extraction via extractor',
						action: 'Extract via extractor',
					},
					{
						name: 'Via Workspace',
						value: 'viaWorkspace',
						description: 'Document extraction via workspace',
						action: 'Extract via workspace',
					},
				],
				default: 'viaExtractor',
			},
		],
	};
}
