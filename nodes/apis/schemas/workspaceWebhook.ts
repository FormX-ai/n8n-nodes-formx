// ref https://github.com/FormX-ai/form-extractor/blob/master/docs/workspace_webhook.md#webhook-payload

import * as z from 'zod';
import {
	extractAPIv2FailureResponseSchema,
	extractAPIv2SuccessResponseSchema,
} from './extractSync';

// quoted from spec - "Same as the response of GET /v2/extract/job/{job-id} if should_include_extraction_result, otherwise URLOnlyExtractAPIv2SuccessResponse"
// Hence, here are just duplicates of extractAPIv2 schemas
// Ignored URLOnlyExtractAPIv2SuccessResponse since should_include_extraction_result flag is always true now, see `subscribeHook` from zapier/app/src/triggers/workspace_extraction.ts
export const workspaceWebhookSuccessResponseSchema = extractAPIv2SuccessResponseSchema;

export type WorkspaceWebhookSuccessResponse = z.infer<typeof workspaceWebhookSuccessResponseSchema>;

export const workspaceWebhookFailureResponseSchema = extractAPIv2FailureResponseSchema;

export type WorkspaceWebhookFailureResponse = z.infer<typeof workspaceWebhookFailureResponseSchema>;

export const workspaceWebhookResponseSchema = z.discriminatedUnion('status', [
	workspaceWebhookSuccessResponseSchema,
	workspaceWebhookFailureResponseSchema,
]);

export type WorkspaceWebhookResponse = z.infer<typeof workspaceWebhookResponseSchema>;
