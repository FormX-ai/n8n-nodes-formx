// ref https://github.com/FormX-ai/form-extractor/blob/master/docs/workspace_webhook.md#webhook-payload

import * as z from 'zod';
import { documentErrorSchema, documentSuccessSchema } from './document';

export const workspaceWebhookSuccessResponseSchema = documentSuccessSchema.extend({
	status: z.literal('ok'),
});

export type WorkspaceWebhookSuccessResponse = z.infer<typeof workspaceWebhookSuccessResponseSchema>;

export const workspaceWebhookFailureResponseSchema = documentErrorSchema.extend({
	status: z.literal('failed'),
});

export type WorkspaceWebhookFailureResponse = z.infer<typeof workspaceWebhookFailureResponseSchema>;

export const workspaceWebhookResponseSchema = z.discriminatedUnion('status', [
	workspaceWebhookSuccessResponseSchema,
	workspaceWebhookFailureResponseSchema,
]);

export type WorkspaceWebhookResponse = z.infer<typeof workspaceWebhookResponseSchema>;
