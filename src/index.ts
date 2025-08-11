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

export const rconPool = new Map<string, RCON>();
export const wsConnection: { client: WebSocket | null } = { client: null };

const buiildApp = () => {
  const app: FastifyInstance = Fastify({
    logger: true,
  });

  app.register(websocket);
  app.register(fastifyCookie);

  app.setErrorHandler((error, request, reply) => {
    console.log("[APP ERROR]: ", error);

    reply.status(500).send({
      success: false,
      msg: "Internal server error",
    });
  });

  app.addHook("onRequest", async (request, reply) => {
    const sessionId = request.cookies.sessionId;

    if (!sessionId && request.url === "/auth/login") return;

    if (!sessionId) {
      return reply.status(400).send({
        success: false,
        msg: "Unauthorized",
      });
    }

    const isSession = await DBAdapter.checkAuth(sessionId);

    if (!isSession) {
      return reply.status(400).send({
        success: false,
        msg: "Unauthorized",
      });
    }
  });

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
