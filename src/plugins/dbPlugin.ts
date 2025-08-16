import type { FastifyInstance, HookHandlerDoneFunction } from "fastify";
import fp from "fastify-plugin";

import DBAdapter from "#db";

const dbPlugin = fp((fastify: FastifyInstance, opts, done: HookHandlerDoneFunction) => {
  fastify.decorate("db", DBAdapter);

  fastify.addHook("onClose", fastify.db.close);

  done();
});

export default dbPlugin;
