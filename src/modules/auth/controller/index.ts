import type { FastifyInstance, HookHandlerDoneFunction } from "fastify";

import check from "./routes/check.js";
import login from "./routes/login.js";

function authController(fastify: FastifyInstance, option: { prefix: string }, done: HookHandlerDoneFunction) {
  login(fastify);
  check(fastify);

  done();
}

export default authController;
