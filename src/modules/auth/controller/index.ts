import db from "#db";
import { Type } from "@sinclair/typebox";

import type { FastifyInstance, HookHandlerDoneFunction } from "fastify";

const RequestSchema = Type.Object({
  username: Type.String(),
  password: Type.String(),
});

function authController(
  fastify: FastifyInstance,
  option: { prefix: string },
  done: HookHandlerDoneFunction,
) {
  fastify.post("/login", { schema: { body: RequestSchema } }, (request, reply) => {
    reply.send("ok");
  });

  done();
}

export default authController;
