import type { Static } from "@sinclair/typebox";
import { Type } from "@sinclair/typebox";
import type { FastifyInstance } from "fastify";
import { rconPool } from "index.js";

const RequestSchema = Type.Object({
  command: Type.String(),
});

const ReplySuccessSchema = Type.Object({
  success: Type.Boolean(),
});

const ReplyErrorSchema = Type.Object({
  error: Type.String(),
});

export type RequestSchemaType = Static<typeof RequestSchema>;

async function sendCommand(fastify: FastifyInstance) {
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
      if (rconPool.size === 0)
        return reply.status(400).send({ error: "RCON Instance is not created" });

      // TODO сделать нормальную авторизацию
      rconPool.get("1")?.commandSend(request.body.command);

      reply.send({ success: true });
    },
  );
}

export default sendCommand;
