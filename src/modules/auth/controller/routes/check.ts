import { FastifyInstance } from "fastify";

import { ReplyErrorSchema, ReplySuccessSchema } from "#schemas/index.js";
import { Type } from "@sinclair/typebox";

const RequestSchema = Type.Object({
  userId: Type.String(),
});

function check(fastify: FastifyInstance) {
  fastify.post(
    "/check",
    {
      schema: {
        body: RequestSchema,
        response: {
          200: ReplySuccessSchema,
          401: ReplyErrorSchema,
        },
      },
    },
    async (request, reply) => {
      const userId = request.body;

      console.log(userId);

      reply.send({ success: true });
    },
  );
}

export default check;
