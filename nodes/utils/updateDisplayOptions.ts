// This file is copied from https://github.com/n8n-io/n8n/blob/master/packages/nodes-base/utils/utilities.ts#L73-L83
import { IDisplayOptions, INodeProperties } from 'n8n-workflow';
import { merge } from 'lodash';

export function updateDisplayOptions(
	displayOptions: IDisplayOptions,
	properties: INodeProperties[],
) {
	return properties.map((nodeProperty) => {
		return {
			...nodeProperty,
			displayOptions: merge({}, nodeProperty.displayOptions, displayOptions),
		};
	});
}
