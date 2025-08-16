import { Type } from "@sinclair/typebox";

export const ReplySuccessSchema = Type.Object({
  success: Type.Boolean(),
  msg: Type.Optional(Type.String()),
});

export const ReplyErrorSchema = Type.Object({
  success: Type.Boolean(),
  msg: Type.String(),
  errors: Type.Optional(
    Type.Array(
      Type.Object({
        message: Type.String(),
        property: Type.Optional(Type.String()),
      }),
    ),
  ),
});
