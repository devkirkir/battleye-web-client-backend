import rconService from "../../service/index.js";
import { Type } from "@sinclair/typebox";
import { rconPool } from "index.js";

import type { FastifyInstance } from "fastify";
import type { Static } from "@sinclair/typebox";

const RequestSchema = Type.Object({
  address: Type.String(),
  port: Type.String(),
  password: Type.String(),
});

const ReplySuccessSchema = Type.Object({
  success: Type.Boolean(),
});

const ReplyErrorSchema = Type.Object({
  error: Type.String(),
});

export type RequestSchemaType = Static<typeof RequestSchema>;

async function connectRoute(fastify: FastifyInstance) {
  return fastify.post<{ Body: RequestSchemaType }>(
    "/connect",
    {
      schema: {
        body: RequestSchema,
        response: {
          200: ReplySuccessSchema,
          400: ReplyErrorSchema,
        },
      },
    },
    async (request, reply) => {
      let response = await rconService().connect(request.body);

      if (!response.isConnected) return reply.status(400).send({ error: response.errorMsg });

      // TODO сделать нормальную авторизацию
      rconPool.set("1", response.rcon);

      reply.send({ success: response.isConnected });
    },
  );
}

export default connectRoute;
