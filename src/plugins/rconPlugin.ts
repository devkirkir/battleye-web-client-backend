import RCON from "battleye-node";
import type { FastifyInstance, HookHandlerDoneFunction } from "fastify";
import fp from "fastify-plugin";

const rconPlugin = fp((fastify: FastifyInstance, opts, done: HookHandlerDoneFunction) => {
  const rconPool = new Map<number, RCON>();

  fastify.decorate("rconPool", rconPool);

  fastify.addHook("onClose", () => {
    for (const rcon of rconPool.values()) {
      rcon.logout();
    }
  });

  done();
});

export default rconPlugin;
