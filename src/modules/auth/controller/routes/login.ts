import { Static, Type } from "@sinclair/typebox";
import type { FastifyInstance } from "fastify";

import { ReplyErrorSchema, ReplySuccessSchema } from "#schemas/index.js";

const RequestSchema = Type.Object({
  username: Type.String(),
  password: Type.String(),
});

type RequestSchemaType = Static<typeof RequestSchema>;
type ReplySchemaType = Static<typeof ReplyErrorSchema>;

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
      const loginSuccess = await fastify.db.login(request.body);

      if (!loginSuccess) {
        const replyObj: ReplySchemaType = {
          success: false,
          msg: "Incorrect auth data",
          errors: [
            { message: "Incorrect data", property: "username" },
            { message: "Incorrect data", property: "password" },
          ],
        };

        return reply.status(400).send(replyObj);
      }

      reply
        .setCookie("sessionId", String(loginSuccess), {
          httpOnly: true,
          maxAge: 10800,
        })
        .send({
          success: true,
        });
    },
  );
}

export default login;
