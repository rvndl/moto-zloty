import { eq } from "drizzle-orm";
import { db } from "../db";
import { scraped } from "../db/schema";
import { Scraper } from "../lib/scraper";
import { err, ok } from "./types";

export abstract class ScraperService {
  static async scrape(url: string) {
    const scrapes = await db.select().from(scraped);
    const scrapedUrls = scrapes.map((s) => s.sourceUrl);

    const scraper = new Scraper({
      excludeUrls: scrapedUrls,
      url,
    });

    try {
      const result = await scraper.scrape();

      if (!result.length) {
        return ok({ scrapes: [] });
      }

      const mappedScrapes = result.map((r) => ({
        sourceUrl: r.url,
        title: r.title,
        description: r.description,
        imageUrl: r.imageUrl,
        place: r.place,
        seen: false,
      }));

      const scrapes = await db
        .insert(scraped)
        .values(mappedScrapes)
        .returning();

      return ok({ scrapes });
    } catch (error) {
      console.log(error);
      return err(500, "Wystąpił błąd podczas scrapowania danych");
    }
  }

  static async getAll() {
    try {
      const scrapes = await db.select().from(scraped).orderBy(scraped.seen);
      return ok({ scrapes });
    } catch (error) {
      console.log(error);
      return err(500, "Wystąpił błąd podczas pobierania danych");
    }
  }

  static async markAsSeen(id: string) {
    try {
      const [updated] = await db
        .update(scraped)
        .set({ seen: true })
        .where(eq(scraped.id, id))
        .returning();

      if (!updated) {
        return err(404, "Nie znaleziono wpisu");
      }

      return ok({ scrape: updated });
    } catch (error) {
      console.log(error);
      return err(500, "Wystąpił błąd podczas aktualizacji wpisu");
    }
  }
}
