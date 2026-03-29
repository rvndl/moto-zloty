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

export const FacebookPostWeek = t.Object({
  start: t.String({
    format: "date-time",
    description: "Inclusive week start in ISO 8601 format",
  }),
  end: t.String({
    format: "date-time",
    description: "Inclusive week end in ISO 8601 format",
  }),
  label: t.String({ description: "Human readable week label" }),
});

export const FacebookPostBody = t.Object({
  weeks: t.Array(FacebookPostWeek, {
    minItems: 1,
    description: "Selected weeks for the generated Facebook post",
  }),
});

export const FacebookPostResponse = t.Object({
  description: t.String({
    description: "AI-generated short introduction for the Facebook post",
  }),
  content: t.String({
    description: "Complete Facebook post content ready to publish",
  }),
  eventCount: t.Number({
    description: "Number of events included in the generated content",
  }),
});
