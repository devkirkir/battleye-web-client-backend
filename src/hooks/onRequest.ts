import type { FastifyReply, FastifyRequest } from "fastify";

const onRequestHook = async (request: FastifyRequest, reply: FastifyReply) => {
  const sessionId = request.cookies.sessionId;
  const isLoginPath = request.url === "/auth/login";

  if (!sessionId && isLoginPath) return;

  if (!sessionId) {
    return reply.status(400).send({
      success: false,
      msg: "Unauthorized",
    });
  }

  const appInstance = request.server;
  const isSession = await appInstance.db.checkSession(sessionId);

  if (!isSession) {
    return reply.status(400).send({
      success: false,
      msg: "Unauthorized",
    });
  }

  request.userId = isSession.userId;

  if (isSession && isLoginPath) {
    return reply.send({
      success: true,
      msg: "Already authenticated",
    });
  }
};

export default onRequestHook;
