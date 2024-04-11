import type { AllEntities } from 'n8n-workflow';

type NodeMap = {
	extractor: 'extract';
	workspace: 'extract';
};

export type FormXType = AllEntities<NodeMap>;
