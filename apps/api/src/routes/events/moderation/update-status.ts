import { Elysia, t } from "elysia";
import { modMiddleware } from "../../../lib/auth";
import { ErrorResponse } from "../../../models/common";
import { EventService, type EventStatus } from "../../../services";

export const updateStatusRoute = new Elysia({
  name: "routes.events.moderation.updateStatus",
})
  .use(modMiddleware)
  .model({
    "common.error": ErrorResponse,
  })
  .put(
    "/:id/updateStatus",
    async ({ params, body, user, status }) => {
      const result = await EventService.updateStatus(
        params.id,
        body.status as EventStatus,
        user.id,
        user.username,
      );

      if (!result.success) {
        return status(result.statusCode as 404, { error: result.error });
      }

      return result.data;
    },
    {
      params: t.Object({
        id: t.String({ format: "uuid" }),
      }),
      body: t.Object({
        status: t.Union([
          t.Literal("pending"),
          t.Literal("approved"),
          t.Literal("rejected"),
        ]),
      }),
      response: {
        404: "common.error",
      },
      detail: {
        summary: "Update event status (mod only)",
        tags: ["Moderation"],
      },
    },
  );
