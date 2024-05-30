import * as z from 'zod';
import { jsonSchema, positiveInteger, unitInterval } from './common';
import { detailedDataValueSchema } from './detailedDataValue';
import { formXErrorSchema } from './error';
// Referenced from https://github.com/FormX-ai/form-extractor/blob/master/docs/v2_extract_api.md#2-response-schema

const orientation = z.union([z.literal(0), z.literal(90), z.literal(180), z.literal(270)]);

const documentMetadataSchema = z.object({
	page_no: z.union([positiveInteger, z.array(positiveInteger)]), // start from 1, being array if document include more than one page
	slice_no: positiveInteger, // start from 1, will be reset for different page
	extractor_type: z.string(),
	orientation: orientation.optional(), // appear if `output_orientation` is set to `true`, possible values are 0, 90, 180, 27
});

export const documentSuccessSchema = z.object({
	extractor_id: z.string(),
	metadata: documentMetadataSchema,

	data: jsonSchema,

	/* key :user-defined field name; value: array
     example 1 - document with ONE signature [A] detected
     {
       "signature": [detailedValueA],
       // other extraction
     }

     example 2 - document with MULTIPLE signatures [A, B, .... Z] detected
     {
       "signature": [detailedValueA, detailedValueB, ..., detailedValueZ],
       // other extraction
     }
   */
	detailed_data: z.record(z.string(), z.array(detailedDataValueSchema)),

	// Following 3 fields exists if detect_multi_document=true in request
	type: z.string().optional(),
	type_confidence: unitInterval.optional(), // 0 to 1
	bounding_box: z.array(z.number()).length(4).optional(), // [left, top, right, bottom], in fraction

	// Following fields are undocumented and for internal use only
	image: z.string().base64().optional(), // base64 encoded image
	ocr: z.union([z.string(), z.array(z.string())]).optional(), // appear if `output_ocr` is set to `true`
	llm_prompt: z.array(z.string()).optional(), // appear if `output_llm_prompt` is set to `true`
});

export const documentErrorSchema = z.object({
	extractor_id: z.string().optional(),
	metadata: documentMetadataSchema,
	error: formXErrorSchema,
});

export const documentSchema = z.union([documentSuccessSchema, documentErrorSchema]);

export type DocumentSuccess = z.infer<typeof documentSuccessSchema>;
export type DocumentError = z.infer<typeof documentErrorSchema>;
export type Document = z.infer<typeof documentSchema>;
export type DocumentMetadata = z.infer<typeof documentMetadataSchema>;

export const isDocumentError = (d: Document): boolean => {
	return documentErrorSchema.safeParse(d).success;
};

export const filterSuccessDocuments = (docs: Document[]): DocumentSuccess[] => {
	const result: DocumentSuccess[] = [];

	for (const doc of docs) {
		const parsed = documentSuccessSchema.safeParse(doc);
		if (parsed.success) {
			const successDoc: DocumentSuccess = parsed.data;
			result.push(successDoc);
		}
	}

	return result;
};
