import { IExecuteFunctions } from 'n8n-workflow';

export async function getBinaryDataFromField(
	this: IExecuteFunctions,
	i: number,
	fieldName: string,
): Promise<Buffer | undefined> {
	const binaryDataField = this.getNodeParameter(fieldName, i);

	let dataBuffer: Buffer | undefined = undefined;
	if (binaryDataField && this.helpers.assertBinaryData(i, binaryDataField)) {
		dataBuffer = await this.helpers.getBinaryDataBuffer(i, binaryDataField);
	}

	return dataBuffer;
}
