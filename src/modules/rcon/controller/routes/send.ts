import { ReplyErrorSchema, ReplySuccessSchema } from "#schemas/index.js";
import { Static, Type } from "@sinclair/typebox";
import type { FastifyInstance } from "fastify";

const RequestSchema = Type.Object({
  command: Type.String(),
});

export type RequestSchemaType = Static<typeof RequestSchema>;

function send(fastify: FastifyInstance) {
  return fastify.post<{ Body: RequestSchemaType }>(
    "/send",
    {
      schema: {
        body: RequestSchema,
        response: {
          200: ReplySuccessSchema,
          400: ReplyErrorSchema,
        },
      },
    },
    (request, reply) => {
      if (fastify.rconPool.size === 0 || !request.userId)
        return reply.status(400).send({ success: false, msg: "RCON Instance is not created" });

      const rcon = fastify.rconPool.get(request.userId);
      if (!rcon) return reply.status(400).send({ success: false, msg: "RCON Instance is not created" });

      rcon.commandSend(request.body.command);

      reply.send({ success: true });
    },
  );
}

export default send;
