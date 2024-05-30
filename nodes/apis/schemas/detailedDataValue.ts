import * as z from 'zod';
import { jsonSchema, scalarSchema, unitInterval } from './common';
// Referenced from https://github.com/FormX-ai/form-extractor/blob/master/docs/v2_extract_api.md#2-response-schema

const baseDataValueSchema = z.object({
	confidence: unitInterval.optional(), // 0 to 1
	bounding_box: z.array(z.number()).length(4).optional(), // left, top, right, bottom in fraction

	extracted_by: z.string(),

	// Following fields are undocumented and for internal use only
	image: z.string().base64().optional(), // base64 encoded image
});

// usage: ubiquitous
export const scalarValueSchema = baseDataValueSchema.extend({
	value: scalarSchema,
	value_type: z.literal('scalar'),
});

// usage: FSL list field
export const listOfScalarValueSchema = baseDataValueSchema.extend({
	value: z.array(scalarSchema),
	value_type: z.literal('list_of_scalar'),
});

// usage: name with title
export const dictValueSchema = baseDataValueSchema.extend({
	value: jsonSchema,
	value_type: z.literal('dict'),
});

// usage: product-line items
export const listOfDictValueSchema = baseDataValueSchema.extend({
	value: z.array(jsonSchema),
	value_type: z.literal('list_of_dict'),
});

export const detailedDataValueSchema = z.union([
	scalarValueSchema,
	listOfScalarValueSchema,
	dictValueSchema,
	listOfDictValueSchema,
]);

export type ScalarValue = z.infer<typeof scalarValueSchema>;
export type ListOfScalarValue = z.infer<typeof listOfScalarValueSchema>;
export type DictValue = z.infer<typeof dictValueSchema>;
export type ListOfDictValue = z.infer<typeof listOfDictValueSchema>;

export type BaseDataValue = z.infer<typeof baseDataValueSchema>;

export type DetailedDataValue = z.infer<typeof detailedDataValueSchema>;

export const isListOfDict = (v: DetailedDataValue): boolean => {
	return listOfDictValueSchema.safeParse(v).success;
};

export const filterListOfDictValue = (value: DetailedDataValue): ListOfDictValue | undefined => {
	const parsed = listOfDictValueSchema.safeParse(value);
	if (parsed.success) {
		const listOfDictValue: ListOfDictValue = parsed.data;
		return listOfDictValue;
	}
	return undefined;
};
