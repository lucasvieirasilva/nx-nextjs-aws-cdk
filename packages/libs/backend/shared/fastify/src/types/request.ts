import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { FastifyRequest } from 'fastify';

type RawType = FastifyRequest['raw'];

export type AuthFastifyRequest<T extends FastifyRequest = FastifyRequest> =
  T & {
    raw: RawType;
  };

export type LambdaFastifyRequest<T extends FastifyRequest = FastifyRequest> =
  T & {
    awsLambda: {
      event: APIGatewayProxyEvent;
      content: Context;
    };
  };

export type RawBodyFastifyRequest<T extends FastifyRequest = FastifyRequest> =
  T & {
    rawBody: string;
  };
