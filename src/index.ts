import fastifyCookie from "@fastify/cookie";
import websocket, { type WebSocket } from "@fastify/websocket";
import RCON from "battleye-node";
import type { FastifyInstance } from "fastify";
import Fastify from "fastify";

import authController from "#auth/controller/index.js";
import appConfig from "#config/index.js";
import DBAdapter from "#db";
import rconController from "#rcon/controller/index.js";
import wsController from "#ws/controller/index.js";
import onRequestHook from "hooks/onRequest.js";
import errorHandler from "handlers/errorHandler.js";

export const rconPool = new Map<string, RCON>();
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

  app.register(websocket);
  app.register(fastifyCookie);

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
    await DBAdapter.connect();
  } catch (err) {
    console.log("[START SERVER ERROR]: ", err);
  }
};

start();
