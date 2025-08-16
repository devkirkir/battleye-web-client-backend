import websocket from "@fastify/websocket";
import fastifyCookie from "@fastify/cookie";
import dbPlugin from "plugins/dbPlugin.js";
import rconPlugin from "plugins/rconPlugin.js";

export default [websocket, fastifyCookie, dbPlugin, rconPlugin];
