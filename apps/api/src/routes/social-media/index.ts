import { Elysia } from "elysia";
import { modMiddleware } from "../../lib/auth";
import { ErrorResponse } from "../../models/common";
import { FacebookPostBody, FacebookPostResponse } from "../../models/ai";
import { AIService } from "../../services/ai";

export const socialMediaRoute = new Elysia({
  name: "routes.mod.socialMedia",
  prefix: "/mod/socialMedia",
})
  .use(modMiddleware)
  .model({
    "socialMedia.facebook.body": FacebookPostBody,
    "socialMedia.facebook.response": FacebookPostResponse,
    "common.error": ErrorResponse,
  })
  .post(
    "/facebook",
    async ({ body, status }) => {
      const result = await AIService.generateFacebookPost(body.weeks);

      if (!result.success) {
        return status(result.statusCode as 400 | 404 | 500, {
          error: result.error,
        });
      }

      return result.data;
    },
    {
      body: "socialMedia.facebook.body",
      response: {
        200: "socialMedia.facebook.response",
        400: "common.error",
        404: "common.error",
        500: "common.error",
      },
      detail: {
        summary: "Generate Facebook post content for upcoming events",
        tags: ["Moderation"],
      },
    },
  );
