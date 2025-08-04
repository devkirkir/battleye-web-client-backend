import Fastify from "fastify";
import appConfig from "#config/index.js";
import websocket, { type WebSocket } from "@fastify/websocket";
import RCON from "battleye-node";
import DBAdapter from "#db";

// TODO add aliases

import authController from "./modules/auth/controller/index.js";
import rconController from "./modules/rcon/controller/index.js";
import wsController from "./modules/ws/controller/index.js";

import type { FastifyInstance } from "fastify";
const app: FastifyInstance = Fastify({
  logger: true,
});

export const rconPool = new Map<string, RCON>();
export const wsConnection: { client: WebSocket | null } = { client: null };

await app.register(websocket);

app.register(authController, { prefix: "/auth" });
app.register(rconController, { prefix: "/rcon" });
app.register(wsController, { prefix: "/ws" });

app.listen({ port: appConfig.app.port || 5000 }, (err) => {
  if (err) return;

  new DBAdapter().connect();
});
