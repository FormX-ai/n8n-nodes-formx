import type {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	ILoadOptionsFunctions,
	IPollFunctions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

export async function formXApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions | IPollFunctions,
	headers: IDataObject,
	method: IHttpRequestMethods,
	path: string,
	body: IDataObject | string | Buffer = {},
	qs: IDataObject = {},
	uri?: string,
	option: IDataObject = {},
) {
	let options: IHttpRequestOptions = {
		headers: {
			Accept: 'application/json',
			'Content-Type': 'image/*',
			...headers,
		},
		method,
		body,
		qs,
		url: uri || `https://worker.formextractorai.com${path}`,
		json: true,
	};

	options = Object.assign({}, options, option);

	try {
		if (Object.keys(body).length === 0) {
			delete options.body;
		}

		return await this.helpers.httpRequest(options);
	} catch (error) {
		if (error instanceof NodeApiError) throw error;
		if (error.code === 'ERR_OSSL_PEM_NO_START_LINE') {
			error.statusCode = '401';
		}
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}
