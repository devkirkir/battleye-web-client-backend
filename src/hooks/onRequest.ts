import type { FastifyReply, FastifyRequest } from "fastify";

const onRequestHook = async (request: FastifyRequest, reply: FastifyReply) => {
  const sessionId = request.cookies.sessionId;

  if (!sessionId && request.url === "/auth/login") return;

  if (!sessionId) {
    return reply.status(400).send({
      success: false,
      msg: "Unauthorized",
    });
  }

  const instance = request.server;

  const isSession = await instance.db.checkAuth(sessionId);

  if (!isSession) {
    return reply.status(400).send({
      success: false,
      msg: "Unauthorized",
    });
  }

  request.userId = isSession.userId;
};

export default onRequestHook;
