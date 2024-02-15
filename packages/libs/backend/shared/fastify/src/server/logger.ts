import { FastifyServerOptions } from 'fastify';
import { IncomingMessage } from 'http';

const loggerConfig: FastifyServerOptions['logger'] = {
  errorKey: 'error',
  messageKey: 'message',
  base: {},
  timestamp: false,
  formatters: {
    level(label) {
      return { level: label };
    },
  },
  serializers: {
    res(res) {
      return {
        statusCode: res.statusCode,
      };
    },
    req(req) {
      return {
        method: req.method,
        url: req.url,
      };
    },
  },
};

const genReqId = (req: IncomingMessage) => {
  return req.headers['x-request-id'] as string;
};

export const fastifyLoggerConfig: Pick<
  FastifyServerOptions,
  'logger' | 'genReqId'
> = {
  logger: loggerConfig,
  genReqId,
};
