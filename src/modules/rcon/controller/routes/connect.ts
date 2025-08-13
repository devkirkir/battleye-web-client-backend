import { Static, Type } from "@sinclair/typebox";
import type { FastifyInstance } from "fastify";

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
  success: Type.Boolean(),
  msg: Type.String(),
  errors: Type.Optional(
    Type.Array(
      Type.Object({
        message: Type.String(),
        property: Type.Optional(Type.String()),
      }),
    ),
  ),
});

export type RequestSchemaType = Static<typeof RequestSchema>;

function connect(fastify: FastifyInstance) {
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
      if (!request.userId) return reply.status(400).send({ success: false, msg: "Unauthorized" });

      const response = await rconService().connect(request.body);
      if (!response.isConnected) return reply.status(400).send({ success: false, msg: response.msg });

      fastify.rconPool.set(request.userId, response.rcon);

      reply.send({ success: response.isConnected });
    },
  );
}

export default connect;
