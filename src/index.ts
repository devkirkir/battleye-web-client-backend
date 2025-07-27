import Fastify from "fastify";
import fs from "node:fs";
import websocket, { type WebSocket } from "@fastify/websocket";
import RCON from "battleye-node";
import "dotenv/config";

import authController from "auth/controller/index.js";
import rconController from "./rcon/controller/index.js";
import wsController from "ws/controller/index.js";

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

app.listen({ port: Number(process.env.PORT) || 5000 }, (err) => {
  if (err) {
    console.log(err);

    return;
  }

  // const isUserFileExist: boolean = fs.existsSync(process.env.USER_AUTH_FILE || "user.json");

  // if (!isUserFileExist) {
  //   fs.writeFileSync(process.env.USER_AUTH_FILE || "user.json", JSON.stringify({ created: true }));
  // }
});
