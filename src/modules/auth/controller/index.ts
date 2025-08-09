import type { FastifyInstance, HookHandlerDoneFunction } from "fastify";

import login from "./routes/login.js";

function authController(fastify: FastifyInstance, option: { prefix: string }, done: HookHandlerDoneFunction) {
  login(fastify);

  done();
}

export default authController;
