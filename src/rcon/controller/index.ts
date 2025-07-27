import connectRoute from "./routes/connect.js";
import sendCommand from "./routes/sendCommand.js";

import type { FastifyInstance, HookHandlerDoneFunction } from "fastify";

function rconController(
  fastify: FastifyInstance,
  options: { prefix: string },
  done: HookHandlerDoneFunction,
) {
  connectRoute(fastify);
  sendCommand(fastify);

  done();
}

export default rconController;
