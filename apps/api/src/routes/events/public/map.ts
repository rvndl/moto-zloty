import { Elysia, t } from "elysia";
import { EventService } from "../../../services";
import { cache } from "@nowarajs/elysia-cache";
import { redisStore } from "../../../redis";

export const mapRoute = new Elysia({ name: "routes.events.map" })
  .use(cache(redisStore))
  .get(
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
      isCached: { prefix: "events:map:", ttl: 10800 }, // Cache for 3 hours
    },
  );
