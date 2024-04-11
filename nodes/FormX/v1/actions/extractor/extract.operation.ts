import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';
import { updateDisplayOptions } from '../../../../utils/updateDisplayOptions';

const properties: INodeProperties[] = [];

const displayOptions = {
	show: {
		resource: ['extractor'],
		operation: ['extract'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
	// TODO: Implement /v2/extractor
	const response = await this.helpers.httpRequest({
		url: 'https://postman-echo.com/get',
		body: this.getInputData(),
	});

	console.log({ response });
	const returnData: INodeExecutionData[] = [{ json: response as IDataObject }];

	return returnData;
}
