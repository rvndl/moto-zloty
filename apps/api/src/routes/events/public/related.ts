import { Elysia, t } from "elysia";
import { EventService } from "../../../services";
import { cache } from "@nowarajs/elysia-cache";
import { redisStore } from "../../../redis";

export const relatedRoute = new Elysia({
  name: "routes.events.public.related",
})
  .use(cache(redisStore))
  .get(
    "/:id/listRelated/:month/:state",
    async ({ params }) => {
      const { id, month, state } = params;
      return await EventService.getRelated(id, parseInt(month), state);
    },
    {
      params: t.Object({
        id: t.String({ format: "uuid" }),
        month: t.String(),
        state: t.String(),
      }),
      detail: {
        summary: "Get related events by month and state",
        tags: ["Events"],
      },
      isCached: { prefix: "events:related:", ttl: 10800 }, // Cache for 3 hours
    },
  );
