import {
  ContextConfigDefault,
  FastifyReply,
  FastifySchema,
  FastifyTypeProviderDefault,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
} from 'fastify';
import { RouteGenericInterface } from 'fastify/types/route';

export type TypedFastifyReply<TPayload> = FastifyReply<
  RawServerDefault,
  RawRequestDefaultExpression<RawServerDefault>,
  RawReplyDefaultExpression<RawServerDefault>,
  RouteGenericInterface,
  ContextConfigDefault,
  FastifySchema,
  FastifyTypeProviderDefault,
  TPayload
>;
