import type { FastifyInstance, HookHandlerDoneFunction } from "fastify";

import connect from "./routes/connect.js";
import send from "./routes/send.js";

function rconController(fastify: FastifyInstance, options: { prefix: string }, done: HookHandlerDoneFunction) {
  connect(fastify);
  send(fastify);

  done();
}

export default rconController;
