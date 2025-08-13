import { Static, Type } from "@sinclair/typebox";
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
  success: Type.Boolean(),
  msg: Type.String(),
  validation: Type.Object({
    instancePath: Type.String(),
    schemaPath: Type.String(),
    keyword: Type.String(),
    params: Type.Object({
      missingProperty: Type.String(),
    }),
    message: Type.String(),
  }),
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
      const response = await rconService().connect(request.body);

      if (!response.isConnected) return reply.status(400).send({ success: false, msg: response.errorMsg });

      // TODO сделать нормальную авторизацию
      rconPool.set("1", response.rcon);

      reply.send({ success: response.isConnected });
    },
  );
}

export default connect;
