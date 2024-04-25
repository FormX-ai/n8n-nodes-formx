import { IAuthenticateGeneric, ICredentialType, INodeProperties } from 'n8n-workflow';

export class FormXApi implements ICredentialType {
	name = 'formXApi';
	displayName = 'FormX API';
	documentationUrl = 'https://github.com/FormX-ai/n8n-nodes-formx';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			default: '',
		},
	];
	authenticate = {
		type: 'generic',
		properties: {
			qs: {
				api_key: '={{$credentials.apiKey}}',
			},
		},
	} as IAuthenticateGeneric;
}
