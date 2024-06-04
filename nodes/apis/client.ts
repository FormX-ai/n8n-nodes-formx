import {
	IExecuteFunctions,
	IHookFunctions,
	IHttpRequestOptions,
	IN8nHttpFullResponse,
} from 'n8n-workflow';
import { ZodSchema, ZodTypeDef } from 'zod';
import { config } from '../config';
import { UnrecognizedResponseError } from './error';
import { handleExtractResponseError } from './parse';
import {
	checkIfExistsWebhookResponseSchema,
	CheckIfExistWebhookRequest,
	CheckIfExistWebhookResponseSuccess,
} from './schemas/checkIfExistsWebhook';
import { ExtractAPIv2RequestData } from './schemas/extract';
import {
	asyncExtractAPIv2ResponseSchema,
	AsyncExtractAPIv2SuccessResponse,
} from './schemas/extractAsync';
import { extractAPIv2ResponseSchema, ExtractAPIv2SuccessResponse } from './schemas/extractSync';
import {
	extractToWorksapceAPIv2ResponseSchema,
	ExtractToWorkspaceAPIv2RequestData,
	ExtractToWorkspaceAPIv2SuccessResponse,
} from './schemas/extractToWorkspace';
import {
	GetAsyncResultV2PendingResponse,
	getAsyncResultV2ResponseSchema,
	GetAsyncResultV2SuccessResponse,
} from './schemas/getAsyncExtractResult';
import {
	RegisterWebhookRequest,
	registerWebhookResponseSchema,
	RegisterWebhookResponseSuccess,
} from './schemas/registerWebhook';
import {
	UnregisterWebhookRequest,
	unregisterWebhookResponseSchema,
	UnregisterWebhookResponseSuccess,
} from './schemas/unregisterWebhook';

function responseParser<T>(rawJson: any, schema: ZodSchema<T, ZodTypeDef, any>): T {
	try {
		return schema.parse(rawJson);
	} catch (err: unknown) {
		console.error(err);
		throw new UnrecognizedResponseError();
	}
}

export async function syncExtract(
	this: IExecuteFunctions,
	data: ExtractAPIv2RequestData,
): Promise<ExtractAPIv2SuccessResponse> {
	const requestOptions: IHttpRequestOptions = {
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			'X-WORKER-ASYNC': 'false',
			'X-WORKER-ENCODING': 'raw',
			'X-WORKER-IMAGE-URL': data.imageUrl,
			'X-WORKER-PDF-DPI': data.pdfPdi ?? '150',
			'X-WORKER-PROCESSING-MODE': data.processingMode ?? 'per-page',
			'X-WORKER-AUTO-ADJUST-IMAGE-SIZE': data.autoAdjustImageSize ?? true,
			'X-WORKER-OCR-ENGINE': data.ocrEngine ?? '',
		},
		method: 'POST',
		body: data.dataBuffer,
		url: `${config.formxWorkerBaseUrl}/v2/extract`,
		ignoreHttpStatusErrors: true,
		returnFullResponse: true,
	};
	const response = (await this.helpers.httpRequestWithAuthentication.call(
		this,
		'formXApi',
		requestOptions,
	)) as IN8nHttpFullResponse;

	const parsedResponse = responseParser(response.body, extractAPIv2ResponseSchema);
	if (parsedResponse.status === 'failed') {
		throw handleExtractResponseError(response.statusCode, response.body);
	}

	return parsedResponse;
}

export async function asyncExtract(
	this: IExecuteFunctions,
	data: ExtractAPIv2RequestData,
): Promise<AsyncExtractAPIv2SuccessResponse> {
	const requestOptions: IHttpRequestOptions = {
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			'X-WORKER-ASYNC': 'true',
			'X-WORKER-ENCODING': 'raw',
			'X-WORKER-IMAGE-URL': data.imageUrl,
			'X-WORKER-PDF-DPI': data.pdfPdi ?? '150',
			'X-WORKER-PROCESSING-MODE': data.processingMode ?? 'per-page',
			'X-WORKER-AUTO-ADJUST-IMAGE-SIZE': data.autoAdjustImageSize ?? true,
			'X-WORKER-OCR-ENGINE': data.ocrEngine ?? '',
		},
		method: 'POST',
		body: data.dataBuffer,
		url: `${config.formxWorkerBaseUrl}/v2/extract`,
		ignoreHttpStatusErrors: true,
		returnFullResponse: true,
	};
	const response = (await this.helpers.httpRequestWithAuthentication.call(
		this,
		'formXApi',
		requestOptions,
	)) as IN8nHttpFullResponse;

	const parsedResponse = responseParser(response.body, asyncExtractAPIv2ResponseSchema);
	if (parsedResponse.status === 'failed') {
		throw handleExtractResponseError(response.statusCode, response.body);
	}

	return parsedResponse;
}

export async function extractToWorkspace(
	this: IExecuteFunctions,
	data: ExtractToWorkspaceAPIv2RequestData,
): Promise<ExtractToWorkspaceAPIv2SuccessResponse> {
	const requestOptions: IHttpRequestOptions = {
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			'X-WORKER-WORKSPACE-ID': data.workspaceId,
			'X-WORKER-ENCODING': 'raw',
			'X-WORKER-WORKSPACE-FILE-NAME': data.fileName,
			'X-WORKER-IMAGE-URL': data.imageUrl,
			'X-WORKER-PDF-DPI': data.pdfPdi ?? '150',
			'X-WORKER-PROCESSING-MODE': data.processingMode ?? 'per-page',
			'X-WORKER-AUTO-ADJUST-IMAGE-SIZE': data.autoAdjustImageSize ?? true,
			'X-WORKER-OCR-ENGINE': data.ocrEngine ?? '',
		},
		method: 'POST',
		body: data.dataBuffer,
		url: `${config.formxWorkerBaseUrl}/v2/workspace`,
		ignoreHttpStatusErrors: true,
		returnFullResponse: true,
	};
	const response = (await this.helpers.httpRequestWithAuthentication.call(
		this,
		'formXApi',
		requestOptions,
	)) as IN8nHttpFullResponse;

	const parsedResponse = responseParser(response.body, extractToWorksapceAPIv2ResponseSchema);
	if (parsedResponse.status === 'failed') {
		throw handleExtractResponseError(response.statusCode, response.body);
	}

	return parsedResponse;
}

export async function getAsyncExtractionResult(
	this: IExecuteFunctions,
	jobId: string,
): Promise<GetAsyncResultV2SuccessResponse | GetAsyncResultV2PendingResponse> {
	const requestOptions: IHttpRequestOptions = {
		headers: {
			Accept: 'application/json',
		},
		method: 'GET',
		url: `${config.formxWorkerBaseUrl}/v2/extract/jobs/${jobId}`,
		ignoreHttpStatusErrors: true,
		returnFullResponse: true,
	};

	const response = (await this.helpers.httpRequestWithAuthentication.call(
		this,
		'formXApi',
		requestOptions,
	)) as IN8nHttpFullResponse;

	const parsedResponse = responseParser(response.body, getAsyncResultV2ResponseSchema);
	if (parsedResponse.status === 'failed') {
		throw handleExtractResponseError(response.statusCode, response.body);
	}

	return parsedResponse;
}

export async function registerWebhook(
	this: IHookFunctions,
	request: Partial<RegisterWebhookRequest>,
): Promise<RegisterWebhookResponseSuccess> {
	const requestOptions: IHttpRequestOptions = {
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		method: 'POST',
		url: `${config.formxApiBaseUrl}/n8n-register-webhook`,
		body: {
			...request,
			webhook_type: 'workspace:extraction-finished:per-document',
			deliver_on: request.deliver_on ?? 'all',
		},
		ignoreHttpStatusErrors: true,
		returnFullResponse: true,
	};
	const response = (await this.helpers.httpRequestWithAuthentication.call(
		this,
		'formXApi',
		requestOptions,
	)) as IN8nHttpFullResponse;

	const parsedResponse = responseParser(response.body, registerWebhookResponseSchema);
	if (parsedResponse.result.status === 'failed') {
		throw handleExtractResponseError(response.statusCode, response.body);
	}

	return parsedResponse as RegisterWebhookResponseSuccess;
}

export async function unregisterWebhook(
	this: IHookFunctions,
	request: UnregisterWebhookRequest,
): Promise<UnregisterWebhookResponseSuccess> {
	const requestOptions: IHttpRequestOptions = {
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		method: 'POST',
		url: `${config.formxApiBaseUrl}/n8n-unregister-webhook`,
		body: request,
		ignoreHttpStatusErrors: true,
		returnFullResponse: true,
	};
	const response = (await this.helpers.httpRequestWithAuthentication.call(
		this,
		'formXApi',
		requestOptions,
	)) as IN8nHttpFullResponse;

	const parsedResponse = responseParser(response.body, unregisterWebhookResponseSchema);
	if (parsedResponse.result.status === 'failed') {
		throw handleExtractResponseError(response.statusCode, response.body);
	}

	return parsedResponse as UnregisterWebhookResponseSuccess;
}

export async function checkIfWebhookExists(
	this: IHookFunctions,
	request: CheckIfExistWebhookRequest,
): Promise<CheckIfExistWebhookResponseSuccess> {
	const requestOptions: IHttpRequestOptions = {
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		method: 'POST',
		url: `${config.formxApiBaseUrl}/n8n-is-webhook-exists`,
		body: request,
		ignoreHttpStatusErrors: true,
		returnFullResponse: true,
	};
	const response = (await this.helpers.httpRequestWithAuthentication.call(
		this,
		'formXApi',
		requestOptions,
	)) as IN8nHttpFullResponse;

	const parsedResponse = responseParser(response.body, checkIfExistsWebhookResponseSchema);
	if (parsedResponse.result.status === 'failed') {
		throw handleExtractResponseError(response.statusCode, response.body);
	}

	return parsedResponse as CheckIfExistWebhookResponseSuccess;
}
