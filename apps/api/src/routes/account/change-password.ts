import { Elysia, t } from "elysia";
import { authMiddleware } from "../../lib/auth";
import { ErrorResponse, SuccessResponse } from "../../models/common";
import { AccountService } from "../../services";

export const changePasswordRoute = new Elysia({
  name: "routes.account.changePassword",
})
  .use(authMiddleware)
  .model({
    "common.error": ErrorResponse,
    "common.success": SuccessResponse,
  })
  .patch(
    "/changePassword",
    async ({ body, user, status }) => {
      const { currentPassword, newPassword, confirmPassword } = body;

      if (newPassword !== confirmPassword) {
        return status(400, { error: "Hasła muszą być takie same" });
      }

      const result = await AccountService.changePassword(
        user.id,
        currentPassword,
        newPassword,
      );

      if (!result.success) {
        return status(result.statusCode as 400 | 404, { error: result.error });
      }

      return { message: "ok" };
    },
    {
      body: t.Object({
        currentPassword: t.String(),
        newPassword: t.String({ minLength: 8, maxLength: 64 }),
        confirmPassword: t.String(),
      }),
      response: {
        400: "common.error",
        401: "common.error",
        404: "common.error",
      },
      detail: {
        summary: "Change account password",
        tags: ["Account"],
      },
    },
  );
