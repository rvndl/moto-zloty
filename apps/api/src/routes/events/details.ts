import { Elysia } from "elysia";
import { EventIdParams } from "../../models/event";
import { ErrorResponse } from "../../models/common";
import { EventService } from "../../services";

export const detailsRoutes = new Elysia({ name: "routes.events.details" })
  .model({
    "event.params.id": EventIdParams,
    "common.error": ErrorResponse,
  })
  .get(
    "/:id",
    async ({ params, status }) => {
      const result = await EventService.getById(params.id);
      if (!result.success) {
        return status(404, { error: result.error });
      }

      return result.data;
    },
    {
      params: "event.params.id",
      response: {
        404: "common.error",
      },
      detail: {
        summary: "Get event details by ID",
        tags: ["Events"],
      },
    },
  )
  .get(
    "/:id/actions",
    async ({ params }) => await EventService.getActions(params.id),
    {
      params: "event.params.id",
      detail: {
        summary: "Get event action history",
        tags: ["Events"],
      },
    },
  );
