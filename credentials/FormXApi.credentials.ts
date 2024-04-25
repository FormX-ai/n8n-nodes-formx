import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

// ref https://docs.n8n.io/integrations/creating-nodes/build/reference/credentials-files/
export class FormXApi implements ICredentialType {
	name = 'formXApi';
	displayName = 'FormX API';
	documentationUrl = 'https://github.com/FormX-ai/n8n-nodes-formx';
	properties: INodeProperties[] = [
		// TODO: Add access token & extractor ID
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
		},
		{
			displayName: 'Extractor ID',
			name: 'extractorId',
			// extractorId no need to obscure
			// eslint-disable-next-line n8n-nodes-base/cred-class-field-unobscured-sensitive-input
			type: 'string',
			default: '',
			required: true,
		},
	];
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-WORKER-TOKEN': '={{$credentials.accessToken}}',
				'X-WORKER-EXTRACTOR-ID': '={{$credentials.extractorId}}',
			},
		},
	};
	test: ICredentialTestRequest = {
		// dummy request to async extraction api, verify above credentials work
		request: {
			method: 'POST',
			baseURL: 'https://worker.formextractorai.com',
			url: '/v2/extract',
			headers: {
				'X-WORKER-ASYNC': 'true',
				'X-WORKER-IMAGE-URL': 'https://formextractorai.com/sample-invoice-1.d551279a.jpg',
			},
		},
		// ref https://github.com/FormX-ai/form-extractor/blob/master/formx/worker/responses.py
		rules: [
			{
				type: 'responseCode',
				properties: {
					value: 403,
					message:
						'Invalid Access Token, please copy it from https://formextractorai.com/team/tokens',
				},
			},
			{
				type: 'responseCode',
				properties: {
					value: 404,
					message:
						'Invalid Extract ID, please copy it from FormX Portal > Your Extractor > Settings',
				},
			},
		],
	};
}
