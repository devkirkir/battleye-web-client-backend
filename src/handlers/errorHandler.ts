import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";

const errorHandler = (error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
  console.log("[APP ERROR]: ", error);

  if (error.code === "FST_ERR_VALIDATION" && error.validation) {
    return reply.status(400).send({
      success: false,
      msg: "Field validation error",
      errors: error.validation.map((item) => ({
        message: item.message,
        property: item.params.missingProperty,
      })),
    });
  }

  return reply.status(500).send({
    success: false,
    msg: "Internal server error",
  });
};

export default errorHandler;
