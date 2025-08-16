import { type WebSocket } from "@fastify/websocket";
import type { FastifyInstance } from "fastify";
import Fastify from "fastify";
import errorHandler from "handlers/errorHandler.js";
import onRequestHook from "hooks/onRequest.js";

import authController from "#auth/controller/index.js";
import appConfig from "#config/index.js";
import rconController from "#rcon/controller/index.js";
import wsController from "#ws/controller/index.js";

import plugins from "#plugins/index.js";

export const wsConnection: { client: WebSocket | null } = { client: null };

const buiildApp = () => {
  const app: FastifyInstance = Fastify({
    logger: true,
    ajv: {
      customOptions: {
        allErrors: true,
      },
    },
  });

  app.decorateRequest("userId", null);

  for (let plugin of plugins) {
    app.register(plugin);
  }

  app.setErrorHandler(errorHandler);

  app.addHook("onRequest", onRequestHook);

  app.register(authController, { prefix: "/auth" });
  app.register(rconController, { prefix: "/rcon" });
  app.register(wsController, { prefix: "/ws" });

  return app;
};

const start = async () => {
  try {
    const app = buiildApp();

    await app.listen({ port: appConfig.app.port || 5000 });
    await app.db.connect();
  } catch (err) {
    console.log("[START SERVER ERROR]: ", err);
  }
};

start();
