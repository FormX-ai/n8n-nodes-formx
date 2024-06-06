interface Config {
	formxApiBaseUrl: string;
	formxWorkerBaseUrl: string;
	formxPortalBaseUrl: string;
}

function required(value: string | undefined): string {
	if (!value) {
		throw new Error('Missing required config');
	}
	return value;
}

const isDev = process.env.NODE_ENV === 'development';

const devConfig: Config = {
	formxApiBaseUrl: required(process.env.FORMX_API_BASE_URL),
	formxWorkerBaseUrl: required(process.env.FORMX_WORKER_BASE_URL),
	formxPortalBaseUrl: required(process.env.FORMX_PORTAL_BASE_URL),
};

const defaultConfig: Config = {
	formxApiBaseUrl: 'https://api.formextractorai.com',
	formxWorkerBaseUrl: 'https://worker.formextractorai.com',
	formxPortalBaseUrl: 'https://formextractorai.com',
};

export const config = isDev ? devConfig : defaultConfig;
