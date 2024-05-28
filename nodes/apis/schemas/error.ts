import { z } from 'zod';

// formx error codes, see https://help.formx.ai/reference/errors
export enum FormXErrorCode {
	InvalidTokenOrArgument = 1001,
	MissingExtractorID = 1002,
	InvalidImageUrl = 1003,
	CannotLoadImage = 1004,
	FileTooLarge = 1005,
	QuotaExceeded = 1006,
	RateLimitExceeded = 1007,
	ImageDimensionTooLarge = 1009,
	Unauthorized = 1010,
	MissingWorkspaceID = 1011,
	ExtractorIDNotFound = 2001,
	NoAnchorRegion = 2002,
	MismatchingInputImageMasterImage = 2003,
	UnknownExtraction = 2004,
	CombinedExtractorIDNotFound = 2005,
	NoExtractorInCombinedExtractor = 2006,
	NoRecognizedTextInInputImage = 2007,
	ExtractionScript = 2008,
	UndefinedCustomModelExtractorSchema = 2009,
	ExtractionLLM = 2010,
	LLMTokenLengthExceeded = 2011,
	WorkspaceIDNotFound = 2013,
	WorkspaceNotLinkedToExtractor = 2014,
	PostProcessingScript = 2015,
	InferencerClientUnknownServer = 2016,
	InferencerInvalidResponse = 2017,
	InferencerRequest = 2018,
	UnavailableRecognizer = 2019,
	Recognizer = 2020,
}

// ref https://github.com/FormX-ai/form-extractor/blob/master/formx/api/responses.py#L9
const formXErrorStaticSchema = z.object({
	code: z.number(),
	message: z.string(),
	// variable fields
});

export const formXErrorSchema = formXErrorStaticSchema.passthrough();
export type FormXError = z.infer<typeof formXErrorSchema>;

export const formXFailedResponseSchema = z.object({
	status: z.literal('failed'),
	error: formXErrorSchema,
});
export type FormXFailedResponse = z.infer<typeof formXFailedResponseSchema>;

export const formXWorkerFailedResponseSchema = formXFailedResponseSchema;
export type FormXWorkerFailedResponseSchema = z.infer<typeof formXWorkerFailedResponseSchema>;

export const formXAPIFailedResponseSchema = z.object({
	result: formXFailedResponseSchema,
});
export type FormXAPIFailedResponse = z.infer<typeof formXAPIFailedResponseSchema>;
