import { Static, Type } from "@sinclair/typebox";
import type { FastifyInstance } from "fastify";

import authService from "../../service/index.js";

const RequestSchema = Type.Object({
  username: Type.String(),
  password: Type.String(),
});

const ReplySuccessSchema = Type.Object({
  success: Type.Boolean(),
});

const ReplyErrorSchema = Type.Object({
  success: Type.Boolean(),
  msg: Type.String(),
});

type RequestSchemaType = Static<typeof RequestSchema>;

function login(fastify: FastifyInstance) {
  fastify.post<{ Body: RequestSchemaType }>(
    "/login",
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
      const loginSuccess = await authService.login(request.body);

      if (!loginSuccess) {
        return reply.status(400).send({ success: false, msg: "Incorrect auth data" });
      }

      reply.setCookie("sessionId", String(loginSuccess), {
        httpOnly: true,
        maxAge: 10800,
      });

      reply.send({
        success: true,
      });
    },
  );
}

export default login;
