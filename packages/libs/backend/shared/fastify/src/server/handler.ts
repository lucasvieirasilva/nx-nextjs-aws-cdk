import wrapper, { LambdaFastifyOptions } from '@fastify/aws-lambda';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { FastifyInstance } from 'fastify';

export interface ExtendedLambdaFastifyOptions extends LambdaFastifyOptions {
  basePath?: string;
}

export const awsLambdaFastify = (
  server: FastifyInstance,
  options?: ExtendedLambdaFastifyOptions,
) => {
  const innerHandler = wrapper(server, options);

  return (event: APIGatewayProxyEvent, context: Context) => {
    if (options?.basePath) {
      const basePath = `/${options.basePath}/`;

      if (event.path.startsWith(basePath)) {
        event.path = event.path.slice(basePath.length - 1);
      }
    }

    return innerHandler(event, context);
  };
};
