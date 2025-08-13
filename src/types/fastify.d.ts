import RCON from "battleye-node";

declare module "fastify" {
  interface FastifyInstance {
    rconPool: Map<number, RCON>;
  }

  interface FastifyRequest {
    userId: number | null;
  }
}
