import { config } from '../config';
import { FormXErrorCode } from './schemas/error';
/**
 * FormX API specific errors. Message is expected to show to user directly, so they show less technical details.
 */
export class FormXAPIError extends Error {
	formXErrorCode?: FormXErrorCode;

	constructor(msg: string, formXErrorCode?: FormXErrorCode) {
		super(msg);
		this.formXErrorCode = formXErrorCode;
	}
}

export class UnknownFormXAPIError extends Error {
	formXErrorCode?: number;

	constructor(msg: string, formXErrorCode?: number) {
		super(msg);
		this.formXErrorCode = formXErrorCode;
	}
}

export class InvalidTokenError extends FormXAPIError {
	constructor() {
		super(
			`Invalid access token, please copy from [FormX portal > Manage Team](${config.formxPortalBaseUrl}/team/tokens)`,
			FormXErrorCode.InvalidTokenOrArgument,
		);
	}
}

export class InvalidArgumentError extends FormXAPIError {
	constructor() {
		super('Invalid argument, please contact FormX Support', FormXErrorCode.InvalidTokenOrArgument);
	}
}
export class MissingExtractorIDError extends FormXAPIError {
	constructor() {
		super(
			'Extractor ID is required but missing, please contact FormX Support for help',
			FormXErrorCode.MissingExtractorID,
		);
	}
}

export class InvalidImageUrlError extends FormXAPIError {
	constructor() {
		super(
			'Image URL should start with "http://" or "https://"; and the host cannot be "127.0.0.1" or "localhost"',
			FormXErrorCode.InvalidImageUrl,
		);
	}
}

export class CannotLoadImageError extends FormXAPIError {
	constructor() {
		super(
			'Cannot load image, is the image URL publicly accessible?',
			FormXErrorCode.CannotLoadImage,
		);
	}
}

export class FileTooLargeError extends FormXAPIError {
	constructor() {
		super('Uploaded file is too large, should be less than 10.0MB', FormXErrorCode.FileTooLarge);
	}
}

export class QuotaExceededError extends FormXAPIError {
	constructor() {
		super(
			'Usage quota exceeded, please upgrade or contact FormX Support to continue',
			FormXErrorCode.QuotaExceeded,
		);
	}
}

export class RateLimitExceededError extends FormXAPIError {
	constructor() {
		super(
			'Too many requests in a short period of time. Please retry after waiting for a while',
			FormXErrorCode.RateLimitExceeded,
		);
	}
}

export class ImageDimensionTooLargeError extends FormXAPIError {
	constructor() {
		super(
			'Image dimension is too large. The image width or height should be < 11999px and total number of pixels should be <= 75000000',
			FormXErrorCode.ImageDimensionTooLarge,
		);
	}
}

export class UnauthorizedError extends FormXAPIError {
	constructor() {
		super(
			'Unauthorized, does the signed-in account has access to this extractor/workspace?',
			FormXErrorCode.Unauthorized,
		);
	}
}

export class MissingWorkspaceIDError extends FormXAPIError {
	constructor() {
		super(
			'Workspace ID is required but missing, please contact FormX Support for help',
			FormXErrorCode.MissingWorkspaceID,
		);
	}
}

export class ExtractorIDNotFoundError extends FormXAPIError {
	constructor() {
		super(
			'Extractor ID not found, please copy from FormX portal > Extractors > [Target Extractor] > Settings',
			FormXErrorCode.ExtractorIDNotFound,
		);
	}
}

export class NoAnchorRegionError extends FormXAPIError {
	constructor() {
		super(
			'No Anchor Region is set up on the master image in fixed layout extractor',
			FormXErrorCode.NoAnchorRegion,
		);
	}
}

export class MismatchingInputImageMasterImageError extends FormXAPIError {
	constructor() {
		super(
			'Failed to match the image features on input image with the master image in fixed layout extractor',
			FormXErrorCode.MismatchingInputImageMasterImage,
		);
	}
}

export class UnknownExtractionError extends FormXAPIError {
	constructor() {
		super('Something wrong, please retry later', FormXErrorCode.UnknownExtraction);
	}
}
export class CombinedExtractorIDNotFoundError extends FormXAPIError {
	constructor() {
		super(
			'Combined Extractor ID not found, please copy from FormX portal > Extractors > [Target Extractor] > Settings',
			FormXErrorCode.CombinedExtractorIDNotFound,
		);
	}
}

export class NoExtractorInCombinedExtractorError extends FormXAPIError {
	constructor() {
		super(
			'No Extractor Found in Combined Extractor, please add at least one extractor',
			FormXErrorCode.NoExtractorInCombinedExtractor,
		);
	}
}
export class NoRecognizedTextInInputImageError extends FormXAPIError {
	constructor() {
		super(
			'Cannot recognize any text from the input image, please check the image content. For more help, please contact FormX support',
			FormXErrorCode.NoRecognizedTextInInputImage,
		);
	}
}
export class ExtractionScriptError extends FormXAPIError {
	constructor() {
		super(
			'Post-processing script error during extraction, please check post processing script of extractor',
			FormXErrorCode.ExtractionScript,
		);
	}
}

export class UndefinedCustomModelExtractorSchemaError extends FormXAPIError {
	constructor() {
		super(
			'Custom model extractor schema is not defined, please check the schema',
			FormXErrorCode.UndefinedCustomModelExtractorSchema,
		);
	}
}

export class ExtractionLLMError extends FormXAPIError {
	constructor() {
		super('LLM Error during extraction', FormXErrorCode.ExtractionLLM);
	}
}
export class LLMTokenLengthExceededError extends FormXAPIError {
	constructor() {
		super(
			'Document content has too many words and exceeded LLM token length limits. Please try to split into multiple smaller documents, or contact FormX support for help',
			FormXErrorCode.LLMTokenLengthExceeded,
		);
	}
}

export class WorkspaceIDNotFoundError extends FormXAPIError {
	constructor() {
		super(
			'Workspace ID not found, please copy from FormX portal > Workspaces > [Target Workspace] > Settings',
			FormXErrorCode.WorkspaceIDNotFound,
		);
	}
}

export class WorkspaceNotLinkedToExtractorError extends FormXAPIError {
	constructor() {
		super(
			'Workspace is not linked to the any extractor, please add at least one extractor to workspace',
			FormXErrorCode.WorkspaceNotLinkedToExtractor,
		);
	}
}

export class PostProcessingScriptError extends FormXAPIError {
	constructor() {
		super(
			'Invalid post processing result, please check the post processing script',
			FormXErrorCode.PostProcessingScript,
		);
	}
}
export class InferencerClientUnknownServerError extends FormXAPIError {
	constructor() {
		super(
			'Error during extraction, please try again later (Inferencer client error: Unknown server error [detect-multi-document-inferencer])',
			FormXErrorCode.InferencerClientUnknownServer,
		);
	}
}
export class InferencerInvalidResponseError extends FormXAPIError {
	constructor() {
		super(
			'Error during extraction, please try again later (Invalid inferencer response [detect-multi-document-inferencer])',
			FormXErrorCode.InferencerInvalidResponse,
		);
	}
}
export class InferencerRequestError extends FormXAPIError {
	constructor() {
		super(
			'Error during extraction, please try again later (Inferencer request error [detect- multi-document-inferencer])',
			FormXErrorCode.InferencerRequest,
		);
	}
}

export class UnavailableRecognizerError extends FormXAPIError {
	constructor() {
		super(
			'Something wrong. Please contact FormX support for help (2019: UnavailableRecognizerError)',
			FormXErrorCode.UnavailableRecognizer,
		);
	}
}
export class RecognizerError extends FormXAPIError {
	constructor() {
		super(
			'Error during extraction, please try again later (RecognizerError)',
			FormXErrorCode.Recognizer,
		);
	}
}

export class UnrecognizedResponseError extends FormXAPIError {
	constructor() {
		super('Unrecognized response body, please retry again later', undefined);
	}
}
