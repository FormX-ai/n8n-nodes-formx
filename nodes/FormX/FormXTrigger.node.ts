import {
	IHttpRequestOptions,
	type IDataObject,
	type IHookFunctions,
	type INodeType,
	type INodeTypeDescription,
	type IWebhookFunctions,
	type IWebhookResponseData,
} from 'n8n-workflow';

export class FormXTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'FormX Trigger',
		name: 'formXTrigger',
		// TODO: Ask for clearer official formx.svg
		// eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
		icon: 'file:formx.png',
		group: ['trigger'],
		version: 1,
		description: 'Handle FormX events via webhooks',
		defaults: {
			name: 'FormX Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'formXApi', // must be same name as `../credentials/FormXAPi.credentials.ts` > `FormXAPi.name`
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Trigger On',
				name: 'event',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Document Extracted',
						value: 'documentExtracted',
					},
				],
				default: 'documentExtracted',
			},
			{
				displayName: 'Workspace ID',
				name: 'workspaceId',
				type: 'string',
				noDataExpression: true,
				default: '',
				placeholder: '',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				default: {},
				placeholder: 'Add Field',
				options: [
					{
						displayName: 'Deliver On',
						name: 'deliverOn',
						type: 'options',
						options: [
							{
								name: 'All',
								value: 'all',
							},
							{
								name: 'Success',
								value: 'success',
							},
							{
								name: 'Error',
								value: 'error',
							},
						],
						default: 'all',
					},
				],
			},
		],
	};

	webhookMethods = {
		default: {
			// TODO: Requires implementation of check if webhook url exitst endpoint
			async checkExists(this: IHookFunctions): Promise<boolean> {
				return false;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const workspaceId = this.getNodeParameter('workspaceId', []);
				const additionalFields = this.getNodeParameter('additionalFields', []) as Record<
					string,
					any
				>;

				const deliverOn = additionalFields?.['deliverOn'];
				const credentials = await this.getCredentials('formXApi');
				// TODO: Connect to n8n webhook endpoint after implementation
				const requestOptions: IHttpRequestOptions = {
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
					},
					method: 'POST',
					url: `https://api.form-extractor.pandawork.com/zapier-webhook`,
					body: {
						zap_id: 'TO BE REMOVE',
						hook: webhookUrl,
						workspace_id: workspaceId,
						worker_token: credentials.accessToken,
						webhook_type: 'workspace:extraction-finished:per-document',
						deliver_on: deliverOn ?? 'all',
						/* NOTE: There's an optional field `should_include_extraction_result`, Team agreed it is not useful to users.
						 * >>> Default to true. false to skip sending documents[] or document to reduce webhook payload size.
						 * Suggest DONT expose, coz that case user will need to curl the payload_url again, which violates the assumption that
						 * - user is not familiar with technical stuff
						 * - user wants as few steps in zapier as possible
						 * ref https://github.com/FormX-ai/form-extractor/blob/master/docs/workspace_webhook.md#register-webhook
						 * ref https://oursky.slack.com/archives/CBY13P2R0/p1715582553600359 */
					},
				};
				try {
					const response = (await this.helpers.httpRequestWithAuthentication.call(
						this,
						'formXApi',
						requestOptions,
					)) as IDataObject;
					const result = response.result as IDataObject;
					const webhookData = this.getWorkflowStaticData('node');
					webhookData.webhookId = result.workspace_webhook_id;
					webhookData.secret = result.secret;
				} catch (e) {
					console.error(e);
					throw e;
				}

				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');

				if (webhookData.webhookId !== undefined) {
					// TODO: Connect to n8n webhook endpoint after implementation
					const requestOptions: IHttpRequestOptions = {
						headers: {
							Accept: 'application/json',
							'Content-Type': 'application/json',
						},
						method: 'DELETE',
						url: `https://api.form-extractor.pandawork.com/zapier-webhook`,
						body: {
							workspace_webhook_id: webhookData.webhookId,
							secret: webhookData.secret,
						},
					};
					try {
						(await this.helpers.httpRequestWithAuthentication.call(
							this,
							'formXApi',
							requestOptions,
						)) as IDataObject;
					} catch (e) {
						console.error(e);
						throw e;
					}

					// Remove from the static workflow data so that it is clear
					// that no webhooks are registered anymore
					delete webhookData.webhookId;
					delete webhookData.secret;
				}

				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const bodyData = this.getBodyData();

		return {
			workflowData: [this.helpers.returnJsonArray(bodyData)],
		};
	}
}
