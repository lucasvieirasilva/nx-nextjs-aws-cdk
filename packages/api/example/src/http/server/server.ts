import routes from '../routes';
import { buildServer } from '@nx-example/backend/shared/fastify';

const server = await buildServer(routes);
export default server;
