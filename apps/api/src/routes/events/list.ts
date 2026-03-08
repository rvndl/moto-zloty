import { Elysia } from "elysia";
import { EventListQuery } from "../../models/event";
import { EventService } from "../../services";

export const listRoutes = new Elysia({ name: "routes.events.list" })
  .model({
    "event.query.list": EventListQuery,
  })
  .get(
    "/",
    async ({ query }) => {
      return await EventService.list(query);
    },
    {
      query: "event.query.list",
      detail: {
        summary: "List approved events",
        tags: ["Events"],
      },
    },
  );
