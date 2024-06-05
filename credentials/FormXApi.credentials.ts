import {
	ICredentialDataDecryptedObject,
	ICredentialTestRequest,
	ICredentialType,
	IDataObject,
	IHttpRequestOptions,
	INodeProperties,
} from 'n8n-workflow';
import { config } from '../nodes/config';

// ref https://docs.n8n.io/integrations/creating-nodes/build/reference/credentials-files/
export class FormXApi implements ICredentialType {
	name = 'formXApi';
	displayName = 'FormX API';
	documentationUrl = 'https://github.com/FormX-ai/n8n-nodes-formx';
	properties: INodeProperties[] = [
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
		},
		{
			displayName: 'Workspace/Extractor ID',
			name: 'workspace_or_extractor',
			type: 'options',
			noDataExpression: true,
			options: [
				{
					name: 'Extractor ID',
					value: 'extractorId',
				},
				{
					name: 'Workspace ID',
					value: 'workspaceId',
				},
			],
			default: 'extractorId',
		},
		{
			displayName: 'Extractor ID',
			name: 'extractorId',
			type: 'string',
			default: '',
			required: true,
			displayOptions: {
				show: {
					workspace_or_extractor: ['extractorId'],
				},
			},
		},
		{
			displayName: 'Workspace ID',
			name: 'workspaceId',
			type: 'string',
			default: '',
			required: true,
			displayOptions: {
				show: {
					workspace_or_extractor: ['workspaceId'],
				},
			},
		},
	];
	authenticate = async (
		credentials: ICredentialDataDecryptedObject,
		requestOptions: IHttpRequestOptions,
	): Promise<IHttpRequestOptions> => {
		const header: IDataObject = {
			'X-WORKER-TOKEN': credentials.accessToken,
			'X-WORKER-EXTRACTOR-ID': credentials.extractorId || undefined,
			'X-WORKER-WORKSPACE-ID': credentials.workspaceId || undefined,
		};

		return {
			...requestOptions,
			headers: {
				...requestOptions.headers,
				...header,
			},
		};
	};
	test: ICredentialTestRequest = {
		// dummy request to async extraction api, verify above credentials work
		request: {
			method: 'POST',
			baseURL: config.formxWorkerBaseUrl,
			url: '/verify-access',
			headers: {
				'X-WORKER-TOKEN': '={{$credentials.accessToken}}',
			},
			body: {
				should_check_usage_reach_limit: true,
				extractor_id: '={{$credentials.extractorId}}',
				workspace_id: '={{$credentials.workspaceId}}',
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
