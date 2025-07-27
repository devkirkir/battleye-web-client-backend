import fs from "node:fs";
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
    try {
      const data = fs.readFileSync("user.json");
    } catch (err) {
      console.log(err);
    }

    reply.send("ok");
  });

  done();
}

export default authController;
