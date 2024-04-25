import { IAuthenticateGeneric, ICredentialType, INodeProperties } from 'n8n-workflow';

export class FormXApi implements ICredentialType {
	name = 'formXApi';
	displayName = 'FormX API';
	documentationUrl = 'https://github.com/FormX-ai/n8n-nodes-formx';
	properties: INodeProperties[] = [
		// TODO: Add access token & extractor ID
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
	];
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			qs: {
				api_key: '={{$credentials.apiKey}}',
			},
		},
	};
}
