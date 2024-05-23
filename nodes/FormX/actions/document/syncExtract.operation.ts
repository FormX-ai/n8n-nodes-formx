/* eslint-disable n8n-nodes-base/node-param-display-name-miscased */
import { IDisplayOptions, INodeProperties } from 'n8n-workflow';
import { updateDisplayOptions } from '../../../utils/updateDisplayOptions';

const operations: INodeProperties[] = [
	{
		displayName: 'Image URL',
		name: 'imageUrl',
		type: 'string',
		routing: {
			request: {
				headers: {
					'X-WORKER-IMAGE-URL': '={{$value}}',
				},
			},
		},
		default: '',
		placeholder: 'https://formextractorai.com/sample-invoice-1.d551279a.jpg',
	},
];

const additionalFields: INodeProperties[] = [
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		default: {},
		placeholder: 'Add Field',
		options: [
			{
				displayName: 'Processing Mode',
				name: 'processingMode',
				type: 'options',
				options: [
					{
						name: 'per-page',
						value: 'per-page',
					},
					{
						name: 'per-file',
						value: 'per-file',
					},
					{
						name: 'multiple-documents-per-page',
						value: 'multiple-documents-per-page',
					},
				],
				routing: {
					request: {
						headers: {
							'X-WORKER-PROCESSING-MODE': '={{$value}}',
						},
					},
				},
				default: 'per-page',
			},
			{
				displayName: 'Auto Adjust Image Size',
				name: 'autoAdjustImageSize',
				type: 'boolean',
				default: true,
				routing: {
					request: {
						headers: {
							'X-WORKER-AUTO-ADJUST-IMAGE-SIZE': '={{$value}}',
						},
					},
				},
			},
			{
				displayName: 'Specify OCR Engine',
				name: 'ocrEngine',
				type: 'options',
				options: [
					{
						name: '', // FIXME: investigate on nullable option
						value: '',
					},
					{
						name: 'google',
						value: 'google',
					},
					{
						name: 'azure',
						value: 'azure',
					},
					{
						name: 'tesseract',
						value: 'tesseract',
					},
				],
				routing: {
					request: {
						headers: {
							'X-WORKER-OCR-ENGINE': '={{$value}}',
						},
					},
				},
				default: '',
			},
			{
				displayName: 'PDF DPI',
				name: 'pdfDpi',
				type: 'number',
				default: 150,
				routing: {
					request: {
						headers: {
							'X-WORKER-PDF-DPI': '={{$value}}',
						},
					},
				},
			},
		],
	},
];

const properties: INodeProperties[] = [...operations, ...additionalFields];

const displayOptions: IDisplayOptions = {
	show: {
		resource: ['document'],
		operation: ['syncExtract'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);
