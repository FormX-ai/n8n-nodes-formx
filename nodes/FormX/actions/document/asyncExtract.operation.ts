import { IDisplayOptions, INodeProperties } from 'n8n-workflow';
import { updateDisplayOptions } from '../../../utils/updateDisplayOptions';
import { commonProperties } from './commonProperties';

const properties: INodeProperties[] = [...commonProperties()];

const displayOptions: IDisplayOptions = {
	show: {
		resource: ['document'],
		operation: ['asyncExtract'],
	},
};
export const description = updateDisplayOptions(displayOptions, properties);
