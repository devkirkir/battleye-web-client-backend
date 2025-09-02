import { Static, Type } from "@sinclair/typebox";
import type { FastifyInstance } from "fastify";

import { ReplyErrorSchema, ReplySuccessSchema } from "#schemas/index.js";

const RequestSchema = Type.Object({
  username: Type.String(),
  password: Type.String(),
});

const ReplySuccessSchemaLogin = Type.Intersect([
  ReplySuccessSchema,
  Type.Object({
    data: Type.Optional(
      Type.Object({
        userId: Type.Number(),
      }),
    ),
  }),
]);

type RequestSchemaType = Static<typeof RequestSchema>;
type ReplySchemaType = Static<typeof ReplyErrorSchema>;

function login(fastify: FastifyInstance) {
  fastify.post<{ Body: RequestSchemaType }>(
    "/login",
    {
      schema: {
        body: RequestSchema,
        response: {
          200: ReplySuccessSchemaLogin,
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
        };

        return reply.status(400).send(replyObj);
      }

      reply
        .setCookie("sessionId", String(loginSuccess), {
          httpOnly: true,
          maxAge: 10800,
          sameSite: "none",
          secure: true,
        })
        .send({
          success: true,
          data: {
            userId: loginSuccess.userId,
          },
        });
    },
  );
}

export default login;
