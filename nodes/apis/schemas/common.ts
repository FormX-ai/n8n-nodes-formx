import * as z from 'zod';

export const positiveInteger = z.number().positive().int();
export const unitInterval = z.number().lte(1).gte(0); // ref https://en.wikipedia.org/wiki/Unit_interval

export const scalarSchema = z.union([z.string(), z.number(), z.boolean()]);
// ref https://zod.dev/?id=json-type
export const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
export type Literal = z.infer<typeof literalSchema>;
export type Json = Literal | { [key: string]: Json } | Json[];
export const jsonSchema: z.ZodType<Json> = z.lazy(() =>
	z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]),
);
