import { Elysia, t } from "elysia";
import { modMiddleware } from "../../../lib/auth";
import { ErrorResponse } from "../../../models/common";
import { EventService } from "../../../services";

export const deleteRoute = new Elysia({
  name: "routes.events.moderation.delete",
})
  .use(modMiddleware)
  .model({
    "common.error": ErrorResponse,
  })
  .delete(
    "/:id/delete",
    async ({ params, status }) => {
      const result = await EventService.delete(params.id);

      if (!result.success) {
        return status(result.statusCode as 404, { error: result.error });
      }

      return result.data;
    },
    {
      params: t.Object({
        id: t.String({ format: "uuid" }),
      }),
      response: {
        404: "common.error",
      },
      detail: {
        summary: "Delete event (mod only)",
        tags: ["Moderation"],
      },
    },
  );
