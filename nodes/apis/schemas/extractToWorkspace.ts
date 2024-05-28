import * as z from 'zod';
import { formXWorkerFailedResponseSchema } from './error';
import { ExtractAPIv2RequestHeaderData } from './extract';

export const extractToWorksapceAPIv2SuccessResponseSchema = z.object({
	status: z.literal('ok'),
	request_id: z.string(),
	job_id: z.string(),
});

export type ExtractToWorkspaceAPIv2SuccessResponse = z.infer<
	typeof extractToWorksapceAPIv2SuccessResponseSchema
>;

export const extractToWorksapceAPIv2FailedResponseSchema = formXWorkerFailedResponseSchema;

export type ExtractToWorkspaceAPIv2FailedResponse = z.infer<
	typeof extractToWorksapceAPIv2FailedResponseSchema
>;

export const extractToWorksapceAPIv2ResponseSchema = z.union([
	extractToWorksapceAPIv2SuccessResponseSchema,
	extractToWorksapceAPIv2FailedResponseSchema,
]);
export type ExtractToWorkspaceAPIv2Response = z.infer<typeof extractToWorksapceAPIv2ResponseSchema>;

export interface ExtractToWorkspaceAPIv2RequestHeaderData extends ExtractAPIv2RequestHeaderData {
	workspaceId: string;
	fileName: string;
}
