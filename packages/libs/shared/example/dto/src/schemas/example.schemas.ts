import { type FastifySchema } from 'fastify';
import { Type, type Static } from '@sinclair/typebox';

export const ExampleParams = Type.Object({
  exampleId: Type.Number(),
});

export type ExampleParamsType = Static<typeof ExampleParams>;

// GET /example/:exampleId
export const GetExampleByIdSchema: FastifySchema = {
  params: ExampleParams,
};

export type GetExampleByIdSchemaType = {
  params: ExampleParamsType;
};

export const ExampleBody = Type.Object({
  id: Type.Number(),
  name: Type.String(),
});

export type ExampleBodyType = Static<typeof ExampleBody>;

// POST /example
export const AddExampleSchema: FastifySchema = {
  body: ExampleBody,
};

export type AddExampleSchemaType = {
  body: ExampleBodyType;
};
