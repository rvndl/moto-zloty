import { Elysia } from "elysia";
import { modMiddleware } from "../../lib/auth";
import { ErrorResponse } from "../../models/common";
import { BannerScrapBody, BannerScrapResponse } from "../../models/ai";
import { AIService } from "../../services/ai";

export const bannerScrapRoute = new Elysia({
  name: "routes.mod.bannerScrap",
  prefix: "/mod/bannerScrap",
})
  .use(modMiddleware)
  .model({
    "bannerScrap.body": BannerScrapBody,
    "bannerScrap.response": BannerScrapResponse,
    "common.error": ErrorResponse,
  })
  .post(
    "/",
    async ({ body, status }) => {
      const result = await AIService.bannerScrap(
        body.fileId,
        body.additionalInfo,
      );

      if (!result.success) {
        return status(result.statusCode as 404 | 500, {
          error: result.error,
        });
      }

      return result.data;
    },
    {
      body: "bannerScrap.body",
      response: {
        200: "bannerScrap.response",
        404: "common.error",
        500: "common.error",
      },
      detail: {
        summary: "Extract event data from banner image using AI",
        tags: ["Moderation"],
      },
    },
  );
