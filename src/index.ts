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

const app: FastifyInstance = Fastify({
  logger: true,
});

export const rconPool = new Map<string, RCON>();
export const wsConnection: { client: WebSocket | null } = { client: null };

await app.register(websocket);
app.register(fastifyCookie);

app.register(authController, { prefix: "/auth" });
app.register(rconController, { prefix: "/rcon" });
app.register(wsController, { prefix: "/ws" });

app.listen({ port: appConfig.app.port || 5000 }, (err) => {
  if (err) return;

  DBAdapter.connect();
});
