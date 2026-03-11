import { Elysia } from "elysia";
import { EventService } from "../../../services";

export const byStateRoute = new Elysia({
  name: "routes.events.public.byState",
}).get(
  "/listByState",
  async () => {
    return await EventService.listByStateGrouped();
  },
  {
    detail: {
      summary: "List events grouped by state",
      tags: ["Events"],
    },
  },
);
