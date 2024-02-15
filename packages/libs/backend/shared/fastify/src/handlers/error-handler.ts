import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

const errorMapping: Record<string, number> = {
  ForbiddenError: 403,
  NotFoundError: 404,
  BadRequestError: 400,
  InternalServerError: 500,
};

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  request.log.error(error, 'Request error');
  console.log('ERROR', error);

  if (errorMapping[error.name]) {
    return reply.status(errorMapping[error.name]).send({
      message: error.message,
    });
  }

  if (error.validation) {
    return reply.status(400).send({
      message: 'Validation error',
      validation: error.validation,
    });
  }

  return reply.status(500).send({
    message: error.message,
  });
}
