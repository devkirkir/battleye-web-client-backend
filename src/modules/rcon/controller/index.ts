import type { FastifyInstance, HookHandlerDoneFunction } from "fastify";

import connect from "./routes/connect.js";
import sendCommand from "./routes/sendCommand.js";

function rconController(fastify: FastifyInstance, options: { prefix: string }, done: HookHandlerDoneFunction) {
  connect(fastify);
  sendCommand(fastify);

  done();
}

export default rconController;
