import type { AllEntities } from 'n8n-workflow';

type NodeMap = {
	document: 'syncExtract' | 'asyncExtract' | 'extractToWorkspace';
};

export type FormxType = AllEntities<NodeMap>;
