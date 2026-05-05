import { Elysia } from "elysia";
import { modMiddleware } from "../lib/auth";
import { ErrorResponse } from "../models/common";
import {
  PublishWeeklyEventsBody,
  PublishWeeklyEventsResponse,
} from "../models/instagram-carousel";
import { InstagramCarouselService } from "../services/instagram-carousel";

export const publishWeeklyEventsRoute = new Elysia({
  name: "routes.api.publishWeeklyEvents",
  prefix: "/api",
})
  .use(modMiddleware)
  .model({
    "instagram.publishWeeklyEvents.body": PublishWeeklyEventsBody,
    "instagram.publishWeeklyEvents.response": PublishWeeklyEventsResponse,
    "common.error": ErrorResponse,
  })
  .post(
    "/publish-weekly-events",
    async ({ body, status }) => {
      const result = await InstagramCarouselService.publishWeeklyEvents(body);

      if (!result.success) {
        return status(result.statusCode as 400 | 401 | 403 | 500 | 504, {
          error: result.error,
        });
      }

      return result.data;
    },
    {
      body: "instagram.publishWeeklyEvents.body",
      response: {
        200: "instagram.publishWeeklyEvents.response",
        400: "common.error",
        401: "common.error",
        403: "common.error",
        500: "common.error",
        504: "common.error",
      },
      detail: {
        summary:
          "Generate and publish a weekly Instagram carousel for motorcycle events",
        tags: ["Moderation", "Instagram"],
      },
    },
  );
