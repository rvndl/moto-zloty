import { Elysia } from "elysia";
import { cron } from "@elysiajs/cron";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { file } from "../db/schema";
import { unlink } from "node:fs/promises";
import { createLogger } from "../logger";

const cleanTempFilesLogger = createLogger("job.cleanup");

const THIRTY_MINUTES_MS = 30 * 60 * 1000;

async function cleanTempFiles() {
  try {
    const tempFiles = await db
      .select()
      .from(file)
      .where(eq(file.status, "temporary"));

    for (const tempFile of tempFiles) {
      if (!tempFile.createdAt) {
        continue;
      }

      const fileAge = Date.now() - new Date(tempFile.createdAt).getTime();
      if (fileAge > THIRTY_MINUTES_MS) {
        try {
          await unlink(tempFile.path);
          cleanTempFilesLogger.info(
            `Deleted temporary file from disk: ${tempFile.path}`,
          );
        } catch (err) {
          cleanTempFilesLogger.warn(
            `Could not delete file from disk: ${tempFile.path}`,
            err,
          );
        }

        await db.delete(file).where(eq(file.id, tempFile.id));
        cleanTempFilesLogger.info(
          `Deleted temporary file record: ${tempFile.id}`,
        );
      }
    }
  } catch (error) {
    cleanTempFilesLogger.error("Failed to clean temporary files:", error);
  }
}

export const cleanupJob = new Elysia({ name: "job.cleanup" }).use(
  cron({
    name: "cleanup-temp-files",
    pattern: "*/30 * * * *",
    run: cleanTempFiles,
  }),
);
