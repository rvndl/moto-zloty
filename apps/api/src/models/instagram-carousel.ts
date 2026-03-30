import { t } from "elysia";

export const InstagramCarouselAspectRatio = t.Union([
  t.Literal("1:1"),
  t.Literal("4:5"),
]);

export const WeeklyMotorcycleEvent = t.Object({
  name: t.String({ description: "Event name" }),
  date: t.String({
    format: "date-time",
    description: "Event date in ISO 8601 format",
  }),
  location: t.String({ description: "Event location" }),
  state: t.String({ description: "Polish voivodeship / state" }),
  imageUrl: t.String({
    format: "uri",
    description: "Public image URL for the event banner",
  }),
  eventType: t.Optional(
    t.String({ description: "Optional event type, e.g. zlot, rajd, piknik" }),
  ),
});

export const PublishWeeklyEventsBody = t.Object({
  weekLabel: t.String({ description: "Human-readable week label" }),
  weekStart: t.String({
    format: "date-time",
    description: "Week start in ISO 8601 format",
  }),
  weekEnd: t.String({
    format: "date-time",
    description: "Week end in ISO 8601 format",
  }),
  events: t.Array(WeeklyMotorcycleEvent, {
    minItems: 1,
    description: "Motorcycle events planned for the selected week",
  }),
  dryRun: t.Optional(
    t.Boolean({
      description:
        "Generate slides and upload public preview URLs without publishing to Instagram",
      default: false,
    }),
  ),
  publicBaseUrl: t.Optional(
    t.String({
      description:
        "Public API base URL used to expose generated images, e.g. https://api.example.com",
    }),
  ),
  instagramAccountId: t.Optional(
    t.String({ description: "Instagram Business account ID override" }),
  ),
  accessToken: t.Optional(
    t.String({ description: "Facebook Graph API access token override" }),
  ),
});

export const PublishWeeklyEventsSlide = t.Object({
  kind: t.Union([t.Literal("overview"), t.Literal("state")]),
  title: t.String({ description: "Slide title" }),
  state: t.Optional(
    t.String({ description: "Related voivodeship for state slide" }),
  ),
  fileId: t.String({ description: "Temporary uploaded file ID" }),
  publicUrl: t.String({
    description: "Public image URL used by Instagram Graph API",
  }),
  itemContainerId: t.Optional(
    t.String({ description: "Instagram carousel item container ID" }),
  ),
});

export const PublishWeeklyEventsResponse = t.Object({
  caption: t.String({
    description: "Generated Instagram caption with hashtags",
  }),
  hashtags: t.Array(t.String(), { description: "Generated hashtag list" }),
  aspectRatio: InstagramCarouselAspectRatio,
  eventCount: t.Number({ description: "Total number of events included" }),
  stateCount: t.Number({ description: "Number of states covered" }),
  dryRun: t.Boolean({ description: "Whether publishing was skipped" }),
  slides: t.Array(PublishWeeklyEventsSlide, {
    description: "Generated slides with temporary public URLs",
  }),
  carouselContainerId: t.Nullable(
    t.String({ description: "Instagram carousel container ID" }),
  ),
  publishedMediaId: t.Nullable(
    t.String({ description: "Published Instagram media ID" }),
  ),
});

export type InstagramCarouselAspectRatioType =
  typeof InstagramCarouselAspectRatio.static;
export type WeeklyMotorcycleEventType = typeof WeeklyMotorcycleEvent.static;
export type PublishWeeklyEventsBodyType = typeof PublishWeeklyEventsBody.static;
export type PublishWeeklyEventsSlideType =
  typeof PublishWeeklyEventsSlide.static;
export type PublishWeeklyEventsResponseType =
  typeof PublishWeeklyEventsResponse.static;
