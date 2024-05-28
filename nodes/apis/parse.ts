import { StatusCodes } from 'http-status-codes';
import { ExtractAPIv2FailureResponse } from './schemas/extractSync';
import {
	CannotLoadImageError,
	CombinedExtractorIDNotFoundError,
	ExtractionLLMError,
	ExtractionScriptError,
	ExtractorIDNotFoundError,
	FileTooLargeError,
	FormXAPIError,
	ImageDimensionTooLargeError,
	InferencerClientUnknownServerError,
	InferencerInvalidResponseError,
	InferencerRequestError,
	InvalidArgumentError,
	InvalidImageUrlError,
	InvalidTokenError,
	LLMTokenLengthExceededError,
	MismatchingInputImageMasterImageError,
	MissingExtractorIDError,
	MissingWorkspaceIDError,
	NoAnchorRegionError,
	NoExtractorInCombinedExtractorError,
	NoRecognizedTextInInputImageError,
	PostProcessingScriptError,
	QuotaExceededError,
	RateLimitExceededError,
	RecognizerError,
	UnauthorizedError,
	UnavailableRecognizerError,
	UndefinedCustomModelExtractorSchemaError,
	UnknownExtractionError,
	UnknownFormXAPIError,
	UnrecognizedResponseError,
	WorkspaceIDNotFoundError,
	WorkspaceNotLinkedToExtractorError,
} from './error';
import { FormXErrorCode } from './schemas/error';

export const throwOnExtractError = (
	statusCode: number,
	formXErrorResponse: ExtractAPIv2FailureResponse,
): void => {
	if (statusCode < 400) {
		return;
	}

	const { code: formXErrorCode, message } = formXErrorResponse.error;
	switch (formXErrorCode) {
		case FormXErrorCode.InvalidTokenOrArgument: {
			if (statusCode === StatusCodes.FORBIDDEN) {
				throw new InvalidTokenError();
			} else if (statusCode === StatusCodes.BAD_REQUEST) {
				throw new InvalidArgumentError();
			}
			throw new UnknownFormXAPIError(message, formXErrorCode);
		}
		case FormXErrorCode.MissingExtractorID: {
			throw new MissingExtractorIDError();
		}
		case FormXErrorCode.InvalidImageUrl: {
			throw new InvalidImageUrlError();
		}
		case FormXErrorCode.CannotLoadImage: {
			throw new CannotLoadImageError();
		}
		case FormXErrorCode.FileTooLarge: {
			throw new FileTooLargeError();
		}
		case FormXErrorCode.QuotaExceeded: {
			throw new QuotaExceededError();
		}
		case FormXErrorCode.RateLimitExceeded: {
			throw new RateLimitExceededError();
		}
		case FormXErrorCode.ImageDimensionTooLarge: {
			throw new ImageDimensionTooLargeError();
		}
		case FormXErrorCode.Unauthorized: {
			throw new UnauthorizedError();
		}
		case FormXErrorCode.MissingWorkspaceID: {
			throw new MissingWorkspaceIDError();
		}
		case FormXErrorCode.ExtractorIDNotFound: {
			throw new ExtractorIDNotFoundError();
		}
		case FormXErrorCode.NoAnchorRegion: {
			throw new NoAnchorRegionError();
		}
		case FormXErrorCode.MismatchingInputImageMasterImage: {
			throw new MismatchingInputImageMasterImageError();
		}
		case FormXErrorCode.UnknownExtraction: {
			throw new UnknownExtractionError();
		}
		case FormXErrorCode.CombinedExtractorIDNotFound: {
			throw new CombinedExtractorIDNotFoundError();
		}
		case FormXErrorCode.NoExtractorInCombinedExtractor: {
			throw new NoExtractorInCombinedExtractorError();
		}
		case FormXErrorCode.NoRecognizedTextInInputImage: {
			throw new NoRecognizedTextInInputImageError();
		}
		case FormXErrorCode.ExtractionScript: {
			throw new ExtractionScriptError();
		}
		case FormXErrorCode.UndefinedCustomModelExtractorSchema: {
			throw new UndefinedCustomModelExtractorSchemaError();
		}
		case FormXErrorCode.ExtractionLLM: {
			throw new ExtractionLLMError();
		}
		case FormXErrorCode.LLMTokenLengthExceeded: {
			throw new LLMTokenLengthExceededError();
		}
		case FormXErrorCode.WorkspaceIDNotFound: {
			throw new WorkspaceIDNotFoundError();
		}
		case FormXErrorCode.WorkspaceNotLinkedToExtractor: {
			throw new WorkspaceNotLinkedToExtractorError();
		}
		case FormXErrorCode.PostProcessingScript: {
			throw new PostProcessingScriptError();
		}
		case FormXErrorCode.InferencerClientUnknownServer: {
			throw new InferencerClientUnknownServerError();
		}
		case FormXErrorCode.InferencerInvalidResponse: {
			throw new InferencerInvalidResponseError();
		}
		case FormXErrorCode.InferencerRequest: {
			throw new InferencerRequestError();
		}
		case FormXErrorCode.UnavailableRecognizer: {
			throw new UnavailableRecognizerError();
		}
		case FormXErrorCode.Recognizer: {
			throw new RecognizerError();
		}
		// add more errors here
		default: {
			throw new UnknownFormXAPIError(message, formXErrorCode);
		}
	}
};

export const validateExtractResponse = (
	statusCode: number,
	responseBody: any, // TODO: type force json schema with Zod
): void => {
	if (!('status' in responseBody)) {
		throw new UnrecognizedResponseError();
	}

	switch (responseBody.status) {
		case 'ok':
		case 'pending': {
			return;
		}
		case 'failed': {
			throwOnExtractError(statusCode, responseBody);
			break;
		}
		default: {
			throw new UnrecognizedResponseError();
		}
	}
};

export const handleExtractResponseError = (
	statusCode: number,
	responseBody: any, // TODO: type force json schema with Zod
): void => {
	if (!('status' in responseBody)) {
		throw new Error('Something wrong, please contact FormX support');
	}

	switch (responseBody.status) {
		case 'ok':
		case 'pending': {
			return;
		}
		case 'failed': {
			throwOnExtractError(statusCode, responseBody);
			break;
		}
		default: {
			throw new Error('Something wrong, please contact FormX support');
		}
	}
};
