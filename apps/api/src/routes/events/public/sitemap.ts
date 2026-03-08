import { Elysia } from "elysia";
import { EventService } from "../../../services";

export const sitemapRoute = new Elysia({ name: "routes.events.sitemap" }).get(
  "/sitemapEvents",
  async () => {
    return await EventService.listAll();
  },
  {
    detail: {
      summary: "Get all events for sitemap",
      tags: ["Events"],
    },
  },
);
