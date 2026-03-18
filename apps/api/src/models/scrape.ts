import { t } from "elysia";

export const ScrapeBody = t.Object({
  url: t.String({ description: "URL to scrape" }),
});

export const ScrapeImageImportBody = t.Object({
  url: t.String({ description: "Image URL to import" }),
});

export const ScrapeImageImportResponse = t.Object({
  full_id: t.String(),
  small_id: t.String(),
});
