import type { INodeTypeBaseDescription, IVersionedNodeType } from 'n8n-workflow';
import { VersionedNodeType } from 'n8n-workflow';

import { FormXV1 } from './v1/FormXV1.node';

export class FormX extends VersionedNodeType {
	constructor() {
		const baseDescription: INodeTypeBaseDescription = {
			displayName: 'FormX',
			name: 'FormX',
			// TODO: Ask for clearer official formx.svg
			// eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
			icon: 'file:formx.png',
			group: ['transform'],
			subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
			description: 'Extract image/pdf data from FormX API',
			defaultVersion: 1,
		};

		const nodeVersions: IVersionedNodeType['nodeVersions'] = {
			1: new FormXV1(baseDescription),
		};

		super(nodeVersions, baseDescription);
	}
}
