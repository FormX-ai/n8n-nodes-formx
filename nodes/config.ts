interface Config {
	formxApiBaseUrl: string;
	formxWorkerBaseUrl: string;
}

function required(value: string | undefined): string {
	if (!value) {
		throw new Error('Missing required config');
	}
	return value;
}

export const config: Config = {
	formxApiBaseUrl: required(process.env.FORMX_API_BASE_URL),
	formxWorkerBaseUrl: required(process.env.FORMX_WORKER_BASE_URL),
};
