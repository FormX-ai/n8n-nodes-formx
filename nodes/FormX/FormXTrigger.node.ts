import {
	type IHookFunctions,
	type INodeType,
	type INodeTypeDescription,
	type IWebhookFunctions,
	type IWebhookResponseData,
} from 'n8n-workflow';
import { config } from '../config';
import { deleteWebhookInfo, saveWebhookInfo } from './webhook';
import { registerWebhook, unregisterWebhook } from '../apis/client';
import { shouldRetryOnError } from '../apis/parse';
import { RegisterWebhookRequest } from '../apis/schemas/registerWebhook';
import { UnregisterWebhookRequest } from '../apis/schemas/unregisterWebhook';
import { workspaceWebhookResponseSchema } from '../apis/schemas/workspaceWebhook';
import { retry } from '../utils/retry';

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
				const workspaceId = this.getNodeParameter('workspaceId');
				const additionalFields = this.getNodeParameter('additionalFields', []) as Record<
					string,
					any
				>;

				const deliverOn = additionalFields?.['deliverOn'];
				const credentials = await this.getCredentials('formXApi');
				let error: unknown;
				const response = await retry(
					async () => {
						try {
							return await registerWebhook.call(this, {
								hook: webhookUrl,
								workspace_id: workspaceId,
								worker_token: credentials.accessToken,
								deliver_on: deliverOn,
								...additionalFields,
								/* NOTE: There's an optional field `should_include_extraction_result`, Team agreed it is not useful to users.
								 * >>> Default to true. false to skip sending documents[] or document to reduce webhook payload size.
								 * Suggest DONT expose, coz that case user will need to curl the payload_url again, which violates the assumption that
								 * - user is not familiar with technical stuff
								 * - user wants as few steps in zapier as possible
								 * ref https://github.com/FormX-ai/form-extractor/blob/master/docs/workspace_webhook.md#register-webhook
								 * ref https://oursky.slack.com/archives/CBY13P2R0/p1715582553600359 */
							} as Partial<RegisterWebhookRequest>);
						} catch (err) {
							error = err;
							throw err;
						}
					},
					{ retries: 5, retryIntervalMs: 5000 },
					() => shouldRetryOnError(error),
				);
				const result = response.result;
				saveWebhookInfo.call(this, {
					webhookId: result.workspace_webhook_id as string,
					secret: result.secret as string,
				});

				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');

				if (webhookData.webhookId !== undefined) {
					let error: unknown;
					await retry(
						async () => {
							try {
								return unregisterWebhook.call(this, {
									workspace_webhook_id: webhookData.webhookId,
									secret: webhookData.secret,
								} as UnregisterWebhookRequest);
							} catch (err) {
								error = err;
								throw err;
							}
						},
						{ retries: 5, retryIntervalMs: 5000 },
						() => shouldRetryOnError(error),
					);

					deleteWebhookInfo.call(this);
				}

				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const bodyData = this.getBodyData();
		const parsedResponse = workspaceWebhookResponseSchema.parse(bodyData);

		return {
			workflowData: [this.helpers.returnJsonArray(parsedResponse)],
		};
	}
}
