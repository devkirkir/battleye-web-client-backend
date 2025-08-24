import fastifyCookie from "@fastify/cookie";
import websocket from "@fastify/websocket";
import fastifyCors from "@fastify/cors";
import dbPlugin from "plugins/dbPlugin.js";
import rconPlugin from "plugins/rconPlugin.js";
import appConfig from "#config/index.js";

const plugins = [
  {
    plugin: websocket,
  },
  {
    plugin: fastifyCookie,
  },
  {
    plugin: dbPlugin,
  },
  {
    plugin: rconPlugin,
  },
  {
    plugin: fastifyCors,
    options: {
      origin: appConfig.app.corsOrigin,
      credentials: true,
    },
  },
];

export default plugins;
