import { Elysia } from "elysia";
import { EventService } from "../../../services";
import { cache } from "@nowarajs/elysia-cache";
import { redisStore } from "../../../redis";

export const byStateRoute = new Elysia({
  name: "routes.events.public.byState",
})
  .use(cache(redisStore))

  .get(
    "/listByState",
    async () => {
      return await EventService.listByStateGrouped();
    },
    {
      detail: {
        summary: "List events grouped by state",
        tags: ["Events"],
      },
      isCached: { prefix: "events:byState:", ttl: 10800 }, // Cache for 3 hours
    },
  );
