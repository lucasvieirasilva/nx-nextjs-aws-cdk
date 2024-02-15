import { FastifyRequest, FastifyReply } from 'fastify';
import { ExampleSchemas, ExampleDtos } from '@nx-example/shared/example/dto';
import { StaticClassTrace } from '@nx-example/backend/shared/tracer';

@StaticClassTrace()
export class ExampleController {
  static data: ExampleDtos.ExampleData[] = [
    {
      id: 1,
      name: 'example1',
    },
  ];

  static async get(request: FastifyRequest, reply: FastifyReply) {
    return reply.send(this.data);
  }

  static async getById(
    request: FastifyRequest<{
      Params: ExampleSchemas.ExampleParamsType;
    }>,
    reply: FastifyReply,
  ) {
    return reply.send(this.data.find((d) => d.id === request.params.exampleId));
  }

  static async add(
    request: FastifyRequest<{
      Body: ExampleSchemas.ExampleBodyType;
    }>,
    reply: FastifyReply,
  ) {
    this.data.push(request.body);

    return reply.send({
      success: true,
    });
  }
}
