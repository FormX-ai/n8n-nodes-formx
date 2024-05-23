import { INodeType, INodeTypeDescription } from 'n8n-workflow';
import { actionProperties } from './actions/actionProperties';

export class FormX implements INodeType {
	description: INodeTypeDescription = {
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
		properties: [...actionProperties],
	};
}
