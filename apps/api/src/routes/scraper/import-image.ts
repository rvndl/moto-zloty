import Elysia from "elysia";
import { ScrapeImageImportBody, ScrapeImageImportResponse } from "../../models";
import { ErrorResponse } from "../../models/common";
import { FileService } from "../../services";

const CONTENT_TYPE_TO_EXTENSION: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export const importImageRoute = new Elysia({
  name: "routes.scraper.importImage",
})
  .model({
    "routes.scraper.importImage.body": ScrapeImageImportBody,
    "routes.scraper.importImage.response": ScrapeImageImportResponse,
    "common.error": ErrorResponse,
  })
  .post(
    "/image",
    async ({ body, status }) => {
      try {
        const response = await fetch(body.url);
        if (!response.ok) {
          return status(400, { error: "Nie udało się pobrać obrazu z URL" });
        }

        const imageBlob = await response.blob();
        const imageType = imageBlob.type || "image/jpeg";
        const extension = CONTENT_TYPE_TO_EXTENSION[imageType] ?? "jpg";

        const imageFile = new File(
          [await imageBlob.arrayBuffer()],
          `scrape-${Date.now()}.${extension}`,
          {
            type: imageType,
          },
        );

        const uploadResult = await FileService.upload(imageFile, {
          convertToWebp: true,
        });

        if (!uploadResult.success) {
          return status(uploadResult.statusCode as 400 | 500, {
            error: uploadResult.error,
          });
        }

        const smallResult = await FileService.upload(imageFile, {
          convertToWebp: true,
          maxWidth: 320,
          maxHeight: 480,
        });

        if (!smallResult.success) {
          return status(smallResult.statusCode as 400 | 500, {
            error: smallResult.error,
          });
        }

        return {
          full_id: uploadResult.data.id,
          small_id: smallResult.data.id,
        };
      } catch {
        return status(500, { error: "Nie udało się zaimportować obrazu" });
      }
    },
    {
      body: "routes.scraper.importImage.body",
      response: {
        200: "routes.scraper.importImage.response",
        400: "common.error",
        500: "common.error",
      },
      detail: {
        summary: "Import image URL to local files",
        tags: ["Scrape"],
      },
    },
  );
