import { t } from "elysia";

export const BannerScrapBody = t.Object({
  fileId: t.String({ format: "uuid", description: "Banner file ID" }),
  additionalInfo: t.Optional(
    t.String({ description: "Additional context for AI processing" }),
  ),
});

export const BannerScrapResponse = t.Object({
  name: t.Nullable(t.String({ description: "Event name" })),
  description: t.Nullable(
    t.String({
      description:
        "Event description in markdown format, properly capitalized, SEO friendly",
    }),
  ),
  dateFrom: t.Nullable(
    t.String({ description: "Start date in ISO 8601 datetime format" }),
  ),
  dateTo: t.Nullable(
    t.String({ description: "End date in ISO 8601 datetime format" }),
  ),
  location: t.Nullable(t.String({ description: "Event location" })),
});
