import { IAuthenticateGeneric, ICredentialType, INodeProperties } from 'n8n-workflow';

export class FormXApi implements ICredentialType {
	name = 'formXApi';
	displayName = 'FormX API';
	documentationUrl = 'https://help.formx.ai/reference/document-extraction';
	properties: INodeProperties[] = [
		{
			displayName: 'AccessToken',
			name: 'accessToken',
			type: 'string',
			default: '',
			placeholder: 'X-WORKER-TOKEN',
			typeOptions: { password: true },
		},
	];
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-WORKER-TOKEN': '={{$credentials.accessToken}}',
			},
		},
	};
	// TODO: Add test; ref https://github.com/n8n-io/n8n/blob/58518b684b6c9495aa6efd0e815a8d01f102bbe4/packages/nodes-base/credentials/SlackApi.credentials.ts#L35
}
