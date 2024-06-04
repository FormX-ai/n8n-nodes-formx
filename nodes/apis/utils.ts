import { IExecuteSingleFunctions, IN8nHttpFullResponse, INodeExecutionData } from 'n8n-workflow';
import { retry } from '../utils/retry';
import { getAsyncExtractionResult } from './client';

export async function pollAsyncResult(
	this: IExecuteSingleFunctions,
	items: INodeExecutionData[],
	response: IN8nHttpFullResponse,
): Promise<INodeExecutionData[]> {
	for (const item of items) {
		const jobId = (item.json as Record<string, string>).job_id;

		// Polling to get result until it's ready / timeout
		const result = await retry(
			async () => {
				const response = await getAsyncExtractionResult.call(this, jobId);
				if (response.status === 'ok') {
					return response;
				} else {
					throw Error('Extraction result not ready');
				}
			},
			{ retries: 30, retryIntervalMs: 1000 },
		);

		item.json = result;
	}

	return items;
}
