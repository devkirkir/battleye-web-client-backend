import { Static, Type } from "@sinclair/typebox";
import type { FastifyInstance } from "fastify";

import authService from "../../service/index.js";

export const RequestSchema = Type.Object({
  username: Type.String(),
  password: Type.String(),
});

type RequestSchemaType = Static<typeof RequestSchema>;

function login(fastify: FastifyInstance) {
  fastify.post<{ Body: RequestSchemaType }>(
    "/login",
    {
      schema: {
        body: RequestSchema,
        response: {
          200: {
            properties: {
              success: { type: "boolean" },
            },
            required: ["success"],
          },
          400: {
            properties: {
              success: { type: "boolean" },
              msg: { type: "string" },
            },
            required: ["success", "msg"],
          },
        },
      },
    },
    async (request, reply) => {
      const loginSuccess = await authService.login(request.body);

      if (!loginSuccess) {
        return reply.status(400).send({ success: false, msg: "Incorrect data" });
      }

      reply.send({
        success: true,
      });
    },
  );
}

export default login;
