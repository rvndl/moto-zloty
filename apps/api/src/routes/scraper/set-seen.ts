import Elysia from "elysia";
import { ScraperService } from "../../services/scraper";

export const setSeenRoute = new Elysia({
  name: "routes.scraper.setSeen",
}).patch(
  "/:id/seen",
  async ({ params }) => {
    await ScraperService.markAsSeen(params.id);
    return { success: true };
  },
  {
    detail: {
      summary: "Mark a scraped item as seen",
      tags: ["Scrape"],
    },
  },
);
