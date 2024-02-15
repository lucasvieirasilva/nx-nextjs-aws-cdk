import { Handler } from '@fastify/middie';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const xrayTraceMiddleware: Handler = (req: any, _, next) => {
  if (req.log.setBindings !== undefined) {
    req.log.setBindings({
      traceId: process.env._X_AMZN_TRACE_ID?.split(';')[0].replace('Root=', ''),
    });
  }

  next();
};
