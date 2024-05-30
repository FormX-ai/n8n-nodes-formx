import { IHookFunctions } from 'n8n-workflow';

interface WebhookRegistrationInfo {
	webhookId: string;
	secret: string;
}
export function saveWebhookInfo(this: IHookFunctions, info: WebhookRegistrationInfo) {
	const webhookData = this.getWorkflowStaticData('node');
	webhookData.webhookId = info.webhookId;
	webhookData.secret = info.secret;
}

export function deleteWebhookInfo(this: IHookFunctions) {
	const webhookData = this.getWorkflowStaticData('node');
	// Remove from the static workflow data so that it is clear
	// that no webhooks are registered anymore
	delete webhookData.webhookId;
	delete webhookData.secret;
}
