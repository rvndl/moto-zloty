import Elysia from "elysia";
import { ScraperService } from "../../services/scraper";

export const listRoute = new Elysia({ name: "routes.scraper.list" }).get(
  "/",
  async () => {
    return await ScraperService.getAll();
  },
  {
    detail: {
      summary: "List scraped items",
      tags: ["Scrape"],
    },
  },
);
