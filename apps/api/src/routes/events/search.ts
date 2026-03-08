import { Elysia, t } from "elysia";
import { EventService } from "../../services";

export const searchRoutes = new Elysia({ name: "routes.events.search" }).get(
  "/search/:query",
  async ({ params }) => {
    return await EventService.search(params.query);
  },
  {
    params: t.Object({
      query: t.String({ minLength: 1, description: "Search query" }),
    }),
    detail: {
      summary: "Search events by name or location",
      tags: ["Events"],
    },
  },
);
