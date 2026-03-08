import { Elysia } from "elysia";
import { authMiddleware } from "../../lib/auth";
import { CreateEventBody } from "../../models/event";
import { ErrorResponse } from "../../models/common";
import { EventService } from "../../services";

export const createRoutes = new Elysia({ name: "routes.events.create" })
  .use(authMiddleware)
  .model({
    "event.body.create": CreateEventBody,
    "common.error": ErrorResponse,
  })
  .put(
    "/",
    async ({ body, user, status }) => {
      const result = await EventService.create(body, user.id, user.username);

      if (!result.success) {
        return status(result.statusCode as 500, { error: result.error });
      }

      return result.data;
    },
    {
      body: "event.body.create",
      response: {
        500: "common.error",
      },
      detail: {
        summary: "Create a new event",
        tags: ["Events"],
      },
    },
  );
