import { Elysia, t } from "elysia";
import { EventService } from "../../../services";

export const mapRoute = new Elysia({ name: "routes.events.map" }).get(
  "/map",
  async ({ query }) => {
    return await EventService.listForMap(query.dateFrom, query.dateTo);
  },
  {
    query: t.Object({
      dateFrom: t.Optional(t.String({ description: "Filter from date" })),
      dateTo: t.Optional(t.String({ description: "Filter to date" })),
    }),
    detail: {
      summary: "Get events for map display",
      tags: ["Events"],
    },
  },
);
