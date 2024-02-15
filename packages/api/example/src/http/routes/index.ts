import { RouteOptions } from 'fastify';
import { exampleRoutes } from './example.routes';

export default (): RouteOptions[] => [...exampleRoutes()];
