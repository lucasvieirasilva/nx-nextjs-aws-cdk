import fastify, { RouteOptions } from 'fastify';
import middie from '@fastify/middie';
import { fastifyLoggerConfig } from './logger';
import { xrayTraceMiddleware } from '../middleware';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import cors from '@fastify/cors';
import { errorHandler } from '../handlers/error-handler';
import rawBodyPlugin, { RawBodyPluginOptions } from 'fastify-raw-body';

export type Config = {
  rawBody?: {
    enabled: boolean;
    options?: RawBodyPluginOptions;
  };
};

export async function buildServer(
  routes: () => RouteOptions[],
  config: Config = {},
) {
  const server = fastify({
    ...fastifyLoggerConfig,
  }).withTypeProvider<TypeBoxTypeProvider>();

  await server.register(cors, {
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  await server.register(middie);
  if (config.rawBody?.enabled) {
    await server.register(rawBodyPlugin, config.rawBody?.options);
  }

  server.use(xrayTraceMiddleware);
  server.setErrorHandler(errorHandler);

  routes().forEach((route) => {
    server.route(route);
  });

  return server;
}
