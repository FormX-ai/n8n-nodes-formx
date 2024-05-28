import * as z from 'zod';
import { formXAPIFailedResponseSchema } from './error';
// ref https://github.com/FormX-ai/form-extractor/blob/master/formx/api/handlers/zapier_webhook.py#L30

export enum WebhookType {
	PerResponse = 'workspace:extraction-finished:per-response',
	PerDocument = 'workspace:extraction-finished:per-document',
}

export enum ExtractionStatus {
	Success = 'success',
	Error = 'error',
	All = 'all',
}

export const registerWebhookRequestSchema = z.object({
	zap_id: z.string(),
	hook: z.string().url(),
	workspace_id: z.string(),
	worker_token: z.string(),
	webhook_type: z.nativeEnum(WebhookType), // no default value
	deliver_on: z.nativeEnum(ExtractionStatus), // no default value
	should_include_extraction_result: z.boolean().optional(),
});

export type RegisterWebhookRequest = z.infer<typeof registerWebhookRequestSchema>;

export const registerWebhookResponseSuccessSchema = z.object({
	result: z.object({
		status: z.literal('ok'),
		workspace_webhook_id: z.string(),
		secret: z.string(),
	}),
});

export type RegisterWebhookResponseSuccess = z.infer<typeof registerWebhookResponseSuccessSchema>;

export const registerWebhookResponseFailedSchema = formXAPIFailedResponseSchema;

export type RegisterWebhookResponseFailed = z.infer<typeof registerWebhookResponseFailedSchema>;

export const registerWebhookResponseSchema = z.union([
	registerWebhookResponseSuccessSchema,
	registerWebhookResponseFailedSchema,
]);

export type RegisterWebhookResponse = z.infer<typeof registerWebhookResponseSchema>;
