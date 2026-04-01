import { Elysia, t } from "elysia";
import { mkdir, unlink } from "node:fs/promises";
import { join } from "node:path";
import { convertToWebp } from "../../lib/image-processor";
import { FileUploadResponse } from "../../models/file";
import { ErrorResponse } from "../../models/common";
import { FileService } from "../../services";
import { createLogger } from "../../logger";

const ACCEPTED_CONTENT_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/jpg",
];
const FOUR_MB = 1024 * 1024 * 4;
const UPLOAD_PATH = Bun.env.UPLOAD_PATH || "./uploads";

const uploadLogger = createLogger("file-upload");

export const uploadRoute = new Elysia({ name: "routes.file.upload" })
  .model({
    "file.response.upload": FileUploadResponse,
    "common.error": ErrorResponse,
  })
  .post(
    "/",
    async ({ body, status }) => {
      const { file: uploadedFile } = body;

      if (!uploadedFile) {
        return status(400, { error: "no file found" });
      }

      if (!ACCEPTED_CONTENT_TYPES.includes(uploadedFile.type)) {
        return status(400, { error: "Nieprawidłowy typ pliku." });
      }

      if (uploadedFile.size > FOUR_MB) {
        return status(400, { error: "Rozmiar pliku jest za duży." });
      }

      const uuid = crypto.randomUUID();
      const ext = uploadedFile.name.split(".").pop() || "png";
      const originalFileName = `${uuid}.${ext}`;
      const originalPath = join(UPLOAD_PATH, originalFileName);

      await mkdir(UPLOAD_PATH, { recursive: true });

      const arrayBuffer = await uploadedFile.arrayBuffer();
      await Bun.write(originalPath, arrayBuffer);

      try {
        const fullWebpPath = await convertToWebp(originalPath, "default");
        const smallWebpPath = await convertToWebp(originalPath, "small");

        await unlink(originalPath);

        const fullResult = await FileService.createFromPath(fullWebpPath);
        if (!fullResult.success) {
          return status(500, { error: fullResult.error });
        }

        const smallResult = await FileService.createFromPath(smallWebpPath);
        if (!smallResult.success) {
          return status(500, { error: smallResult.error });
        }

        return {
          full_id: fullResult.data.id,
          small_id: smallResult.data.id,
        };
      } catch (error) {
        uploadLogger.error("Image processing failed:", error);

        try {
          await unlink(originalPath);
        } catch {}

        return status(500, {
          error:
            "Wystąpił błąd podczas konwersji pliku do .webp. Spróbuj ponownie.",
        });
      }
    },
    {
      body: t.Object({
        file: t.File(),
      }),
      response: {
        200: "file.response.upload",
        400: "common.error",
        500: "common.error",
      },
      detail: {
        summary: "Upload an image file",
        description: "Uploads an image and converts it to WebP format",
        tags: ["Files"],
      },
    },
  );
