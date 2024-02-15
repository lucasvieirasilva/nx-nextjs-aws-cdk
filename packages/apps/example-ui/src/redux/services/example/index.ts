import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '..';
import type {
  ExampleDtos,
  ExampleSchemas,
} from '@nx-example/shared/example/dto';

export const exampleApi = createApi({
  reducerPath: 'exampleApi',
  baseQuery,
  endpoints: (builder) => ({
    get: builder.query<ExampleDtos.ExampleData[], void>({
      query: () => ({ url: '/' }),
    }),
    getById: builder.query<
      ExampleDtos.ExampleData,
      ExampleSchemas.GetExampleByIdSchemaType
    >({
      query: ({ params: { exampleId } }) => ({
        url: `/${exampleId}`,
      }),
    }),
    add: builder.mutation<
      ExampleDtos.ExampleData,
      ExampleSchemas.AddExampleSchemaType
    >({
      query: (body) => ({
        url: '/',
        method: 'POST',
        body,
      }),
    }),
  }),
});
