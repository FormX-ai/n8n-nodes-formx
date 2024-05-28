/* eslint-disable n8n-nodes-base/node-param-display-name-miscased */
import {
	IDataObject,
	IDisplayOptions,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';
import { syncExtract } from '../../../apis/client';
import { ExtractAPIv2RequestHeaderData } from '../../../apis/schemas/extract';
import { updateDisplayOptions } from '../../../utils/updateDisplayOptions';
import { commonProperties } from './commonProperties';

const properties: INodeProperties[] = [...commonProperties()];

const syncDisplayOptions: IDisplayOptions = {
	show: {
		resource: ['document'],
		operation: ['syncExtract'],
	},
};
export const description = updateDisplayOptions(syncDisplayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	const imageUrl = this.getNodeParameter('imageUrl', i, undefined);
	const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;

	const response = await syncExtract.call(this, {
		imageUrl: imageUrl,
		...additionalFields,
	} as ExtractAPIv2RequestHeaderData);
	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(response),
		{ itemData: { item: i } },
	);

	return executionData;
}
