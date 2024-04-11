import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import type { FormXType } from './node.type';

import * as extractor from './extractor/Extractor.resource';
import * as workspace from './workspace/Workspace.resource';

export async function router(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	let returnData: INodeExecutionData[] = [];

	const items = this.getInputData();
	const resource = this.getNodeParameter<FormXType>('resource', 0);
	const operation = this.getNodeParameter('operation', 0);

	const formxNodeData = {
		resource,
		operation,
	} as FormXType;

	try {
		switch (formxNodeData.resource) {
			case 'extractor':
				// @ts-expect-error // copied from https://github.com/n8n-io/n8n/blob/master/packages/nodes-base/nodes/Google/Drive/v2/actions/router.ts#L27, should works fine
				returnData = await extractor[formxNodeData.operation].execute.call(this, items);
				break;
			case 'workspace':
				// @ts-expect-error // copied from https://github.com/n8n-io/n8n/blob/master/packages/nodes-base/nodes/Google/Drive/v2/actions/router.ts#L27, should works fine
				returnData = await workspace[formxNodeData.operation].execute.call(this, items);
				break;
			default:
				throw new NodeOperationError(
					this.getNode(),
					`The operation "${operation}" is not supported!`,
				);
		}
	} catch (error) {
		if (
			error.description &&
			(error.description as string).includes('cannot accept the provided value')
		) {
			error.description = `${error.description}. Consider using 'Typecast' option`;
		}
		throw error;
	}

	return [returnData];
}
