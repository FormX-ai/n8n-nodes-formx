import { IDisplayOptions, INodeProperties } from 'n8n-workflow';

// Copied from https://github.com/n8n-io/n8n/blob/master/packages/nodes-base/utils/utilities.ts#L73-L83
export function updateDisplayOptions(
	displayOptions: IDisplayOptions,
	properties: INodeProperties[],
): INodeProperties[] {
	return properties.map((nodeProperty) => {
		return {
			...nodeProperty,
			displayOptions: { ...nodeProperty.displayOptions, ...displayOptions },
		};
	});
}
