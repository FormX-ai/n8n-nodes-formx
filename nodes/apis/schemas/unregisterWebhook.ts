import * as z from 'zod';
import { formXAPIFailedResponseSchema } from './error';
// ref https://github.com/FormX-ai/form-extractor/blob/master/formx/api/handlers/zapier_webhook.py#L51

// TODO: use n8n webhook endpoint shcema
export const unregisterWebhookRequestSchema = z.object({
	workspace_webhook_id: z.string(),
	secret: z.string(),
});

export type UnregisterWebhookRequest = z.infer<typeof unregisterWebhookRequestSchema>;

export const unregisterWebhookResponseSuccessSchema = z.object({
	result: z.object({
		status: z.literal('ok'),
	}),
});

export type UnregisterWebhookResponseSuccess = z.infer<
	typeof unregisterWebhookResponseSuccessSchema
>;

export const unregisterWebhookResponseFailedSchema = formXAPIFailedResponseSchema;

export type UnregisterWebhookResponseFailed = z.infer<typeof unregisterWebhookResponseFailedSchema>;

export const unregisterWebhookResponseSchema = z.union([
	unregisterWebhookResponseSuccessSchema,
	unregisterWebhookResponseFailedSchema,
]);

export type UnregisterWebhookResponse = z.infer<typeof unregisterWebhookResponseSchema>;
