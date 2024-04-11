/* eslint-disable n8n-nodes-base/node-filename-against-convention */
import type { INodeTypeDescription } from 'n8n-workflow';

import * as extractor from './extractor/Extractor.resource';
import * as workspace from './workspace/Workspace.resource';

export const versionDescription: INodeTypeDescription = {
	displayName: 'FormX',
	name: 'FormX',
	// TODO: Ask for clearer official formx.svg
	// eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
	icon: 'file:formx.png',
	group: ['transform'],
	version: 1,
	subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
	description: 'Extract image/pdf data from FormX API',
	defaults: {
		name: 'FormX',
	},
	inputs: ['main'],
	outputs: ['main'],
	credentials: [
		{
			name: 'formXApi',
			required: true,
			displayOptions: {
				show: {
					authentication: ['accessToken'],
				},
			},
		},
	],
	properties: [
		{
			displayName: 'Authentication',
			name: 'authentication',
			type: 'options',
			options: [
				{
					name: 'Access Token',
					value: 'accessToken',
				},
			],
			default: 'accessToken',
		},
		{
			displayName: 'Resource',
			name: 'resource',
			type: 'options',
			noDataExpression: true,
			options: [
				{
					name: 'Extractor',
					value: 'extractor',
				},
				{
					name: 'Workspace',
					value: 'workspace',
				},
			],
			default: 'extractor',
		},
		...extractor.description,
		...workspace.description,
	],
};
