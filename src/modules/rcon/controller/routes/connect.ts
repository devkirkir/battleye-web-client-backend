import type { Static } from "@sinclair/typebox";
import { Type } from "@sinclair/typebox";
import type { FastifyInstance } from "fastify";
import { rconPool } from "index.js";

import rconService from "../../service/index.js";

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

async function connect(fastify: FastifyInstance) {
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
      const response = await rconService().connect(request.body);

      if (!response.isConnected) return reply.status(400).send({ error: response.errorMsg });

      // TODO сделать нормальную авторизацию
      rconPool.set("1", response.rcon);

      reply.send({ success: response.isConnected });
    },
  );
}

export default connect;
