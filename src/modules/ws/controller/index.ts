import { FastifyInstance, HookHandlerDoneFunction } from "fastify";
import { wsConnection } from "index.js";

function WSController(fastify: FastifyInstance, options: { prefix: string }, done: HookHandlerDoneFunction) {
  fastify.get("/", { websocket: true }, (socket) => {
    wsConnection.client = socket;

    socket.on("message", (message) => {
      socket.send(message);
    });

    socket.on("close", () => {
      console.log("CLOSE CONNECTION FROM CLIENT");
    });
  });

  done();
}

export default WSController;
