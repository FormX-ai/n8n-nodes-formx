import * as z from 'zod';
import { formXWorkerFailedResponseSchema } from './error';
import { documentSchema } from './document';

export const extractAPIv2SuccessResponseSchema = z.object({
	status: z.literal('ok'),
	metadata: z.object({
		job_id: z.string().optional(),
		extractor_id: z.string(),
		request_id: z.string(),
		usage: z.number(),
	}),
	documents: z.array(documentSchema),
});

export type ExtractAPIv2SuccessResponse = z.infer<typeof extractAPIv2SuccessResponseSchema>;

export const extractAPIv2FailureResponseSchema = formXWorkerFailedResponseSchema;

export type ExtractAPIv2FailureResponse = z.infer<typeof extractAPIv2FailureResponseSchema>;

export const extractAPIv2ResponseSchema = z.discriminatedUnion('status', [
	extractAPIv2SuccessResponseSchema,
	extractAPIv2FailureResponseSchema,
]);

export type ExtractAPIv2Response = z.infer<typeof extractAPIv2ResponseSchema>;
