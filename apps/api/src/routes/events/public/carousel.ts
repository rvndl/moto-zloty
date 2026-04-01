import { Elysia } from "elysia";
import { EventService } from "../../../services";
import { cache } from "@nowarajs/elysia-cache";
import { redisStore } from "../../../redis";

export const carouselRoute = new Elysia({
  name: "routes.events.public.carousel",
})
  .use(cache(redisStore))
  .get(
    "/carousel",
    async () => {
      return await EventService.getCarousel();
    },
    {
      detail: {
        summary: "Get events for homepage carousel",
        tags: ["Events"],
      },
      isCached: { prefix: "events:carousel:", ttl: 10800 }, // Cache for 3 hours
    },
  );
