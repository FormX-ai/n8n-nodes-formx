import * as z from 'zod';
import { formXWorkerFailedResponseSchema } from './error';

export const asyncExtractAPIv2SuccessResponseSchema = z.object({
	status: z.literal('ok'),
	request_id: z.string(),
	job_id: z.string(),
});

export type AsyncExtractAPIv2SuccessResponse = z.infer<
	typeof asyncExtractAPIv2SuccessResponseSchema
>;

export const asyncExtractAPIv2FailedResponseSchema = formXWorkerFailedResponseSchema;

export type AsyncExtractAPIv2FailedResponse = z.infer<typeof asyncExtractAPIv2FailedResponseSchema>;

export const asyncExtractAPIv2ResponseSchema = z.union([
	asyncExtractAPIv2SuccessResponseSchema,
	asyncExtractAPIv2FailedResponseSchema,
]);

export type AsyncExtractAPIv2Response = z.infer<typeof asyncExtractAPIv2ResponseSchema>;
