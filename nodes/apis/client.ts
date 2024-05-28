import {
	IExecuteFunctions,
	IHookFunctions,
	IHttpRequestOptions,
	IN8nHttpFullResponse,
} from 'n8n-workflow';
import { ZodSchema, ZodTypeDef } from 'zod';
import { config } from '../config';
import { handleExtractResponseError } from './parse';
import { ExtractAPIv2RequestHeaderData } from './schemas/extract';
import {
	asyncExtractAPIv2ResponseSchema,
	AsyncExtractAPIv2SuccessResponse,
} from './schemas/extractAsync';
import { extractAPIv2ResponseSchema, ExtractAPIv2SuccessResponse } from './schemas/extractSync';
import {
	extractToWorksapceAPIv2ResponseSchema,
	ExtractToWorkspaceAPIv2RequestHeaderData,
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
		console.log(rawJson);
		throw err;
	}
}

export async function syncExtract(
	this: IExecuteFunctions,
	data: ExtractAPIv2RequestHeaderData,
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
		url: `${config.formxWorkerBaseUrl}/v2/extract`,
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
	data: ExtractAPIv2RequestHeaderData,
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
		url: `${config.formxWorkerBaseUrl}/v2/extract`,
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
	data: ExtractToWorkspaceAPIv2RequestHeaderData,
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
		url: `${config.formxWorkerBaseUrl}/v2/workspace`,
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

// TODO: Connect to n8n webhook endpoint after implementation
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
		url: `${config.formxApiBaseUrl}/zapier-webhook`,
		body: {
			// NOTE: Only support per document here
			zap_id: 'TO BE REMOVE',
			webhook_type: 'workspace:extraction-finished:per-document',
			deliver_on: 'all',
			...request,
		},
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

// TODO: Connect to n8n webhook endpoint after implementation
export async function unregisterWebhook(
	this: IHookFunctions,
	request: UnregisterWebhookRequest,
): Promise<UnregisterWebhookResponseSuccess> {
	const requestOptions: IHttpRequestOptions = {
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		method: 'DELETE',
		url: `${config.formxApiBaseUrl}/zapier-webhook`,
		body: request,
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
