import { awsLambdaFastify } from '@nx-example/backend/shared/fastify';
import server from './http/server/server';

export const handler = awsLambdaFastify(server, {
  serializeLambdaArguments: true,
  // basePath: process.env.BASE_PATH ?? 'example',
});
