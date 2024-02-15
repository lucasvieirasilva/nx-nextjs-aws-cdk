import { RouteOptions } from 'fastify';
import { ExampleSchemas } from '@nx-example/shared/example/dto';
import { ExampleController } from '../controllers/example.controller';

export const exampleRoutes = (): RouteOptions[] => [
  {
    method: 'GET',
    url: '/',
    handler: ExampleController.get,
  },
  {
    method: 'GET',
    url: '/:exampleId',
    schema: ExampleSchemas.GetExampleByIdSchema,
    handler: ExampleController.getById,
  },
  {
    method: 'POST',
    url: '/',
    schema: ExampleSchemas.AddExampleSchema,
    handler: ExampleController.add,
  },
];
