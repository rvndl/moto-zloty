import { Elysia } from "elysia";
import { EventService } from "../../../services";

export const carouselRoute = new Elysia({
  name: "routes.events.public.carousel",
}).get(
  "/carousel",
  async () => {
    return await EventService.getCarousel();
  },
  {
    detail: {
      summary: "Get events for homepage carousel",
      tags: ["Events"],
    },
  },
);
