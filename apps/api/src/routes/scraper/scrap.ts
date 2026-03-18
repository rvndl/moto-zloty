import { Elysia } from "elysia";
import { ScrapeBody } from "../../models";
import { ScraperService } from "../../services/scraper";

export const scrapRoute = new Elysia({ name: "routes.scraper.scrape" })
  .model({
    "routes.scraper.scrape.body": ScrapeBody,
  })
  .post(
    "/",
    async ({ body }) => {
      return await ScraperService.scrape(body.url);
    },
    {
      body: "routes.scraper.scrape.body",
      detail: {
        summary: "Scrape a URL",
        tags: ["Scrape"],
      },
    },
  );
