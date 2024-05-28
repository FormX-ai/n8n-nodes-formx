import * as z from 'zod';
import { formXWorkerFailedResponseSchema } from './error';
import { documentSchema } from './document';

export const getAsyncResultV2SuccessResponseSchema = z.object({
	status: z.literal('ok'),
	metadata: z.object({
		job_id: z.string().optional(),
		extractor_id: z.string(),
		request_id: z.string(),
		usage: z.number(),
	}),
	documents: z.array(documentSchema),
});

export type GetAsyncResultV2SuccessResponse = z.infer<typeof getAsyncResultV2SuccessResponseSchema>;

export const getAsyncResultV2FailureResponseSchema = formXWorkerFailedResponseSchema;

export type GetAsyncResultV2FailureResponse = z.infer<typeof getAsyncResultV2FailureResponseSchema>;

export const getAsyncResultV2PendingResponseSchema = z.object({
	status: z.literal('pending'),
	job_id: z.string(),
	request_id: z.string().optional(),
});

export type GetAsyncResultV2PendingResponse = z.infer<typeof getAsyncResultV2PendingResponseSchema>;

export const getAsyncResultV2ResponseSchema = z.discriminatedUnion('status', [
	getAsyncResultV2SuccessResponseSchema,
	getAsyncResultV2FailureResponseSchema,
	getAsyncResultV2PendingResponseSchema,
]);

export type GetAsyncResultV2Response = z.infer<typeof getAsyncResultV2ResponseSchema>;
