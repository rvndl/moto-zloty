import { Elysia } from "elysia";
import { modMiddleware } from "../../../lib/auth";
import { EventService } from "../../../services";

export const listRoute = new Elysia({
  name: "routes.mod.events",
  prefix: "/mod",
})
  .use(modMiddleware)
  .get(
    "/events",
    async () => {
      return await EventService.listAll();
    },
    {
      detail: {
        summary: "List all events (mod only)",
        tags: ["Moderation"],
      },
    },
  );
