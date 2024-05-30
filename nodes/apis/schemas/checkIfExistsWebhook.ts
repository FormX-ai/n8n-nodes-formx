import * as z from 'zod';
import { formXAPIFailedResponseSchema } from './error';

export const checkIfExistsWebhookRequestSchema = z.object({
	worker_token: z.string(),
	workspace_webhook_id: z.string(),
});

export type CheckIfExistWebhookRequest = z.infer<typeof checkIfExistsWebhookRequestSchema>;

export const checkIfExistsWebhookResponseSuccessSchema = z.object({
	result: z.object({
		status: z.literal('ok'),
		exists: z.boolean(),
	}),
});

export type CheckIfExistWebhookResponseSuccess = z.infer<
	typeof checkIfExistsWebhookResponseSuccessSchema
>;

export const checkIfExistsWebhookResponseFailedSchema = formXAPIFailedResponseSchema;

export type CheckIfExistWebhookResponseFailed = z.infer<
	typeof checkIfExistsWebhookResponseFailedSchema
>;

export const checkIfExistsWebhookResponseSchema = z.union([
	checkIfExistsWebhookResponseSuccessSchema,
	checkIfExistsWebhookResponseFailedSchema,
]);

export type CheckIfExistWebhookResponse = z.infer<typeof checkIfExistsWebhookResponseSchema>;
