import RCON from "battleye-node";

import type { DatabaseAdapter } from "./db.ts";

declare module "fastify" {
  interface FastifyInstance {
    rconPool: Map<number, RCON>;
    db: DatabaseAdapter;
  }

  interface FastifyRequest {
    userId: number | null;
  }
}
