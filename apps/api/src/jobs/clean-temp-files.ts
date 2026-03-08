import { Elysia } from "elysia";
import { cron } from "@elysiajs/cron";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { file } from "../db/schema";
import { unlink } from "node:fs/promises";

const THIRTY_MINUTES_MS = 30 * 60 * 1000;

async function cleanTempFiles() {
  try {
    const tempFiles = await db
      .select()
      .from(file)
      .where(eq(file.status, "temporary"));

    for (const tempFile of tempFiles) {
      if (!tempFile.createdAt) continue;

      const fileAge = Date.now() - new Date(tempFile.createdAt).getTime();
      if (fileAge > THIRTY_MINUTES_MS) {
        try {
          await unlink(tempFile.path);
          console.log(`Deleted temporary file from disk: ${tempFile.path}`);
        } catch (err) {
          console.warn(`Could not delete file from disk: ${tempFile.path}`);
        }

        await db.delete(file).where(eq(file.id, tempFile.id));
        console.log(`Deleted temporary file record: ${tempFile.id}`);
      }
    }
  } catch (error) {
    console.error("Failed to clean temporary files:", error);
  }
}

export const cleanupJob = new Elysia({ name: "job.cleanup" }).use(
  cron({
    name: "cleanup-temp-files",
    pattern: "*/30 * * * *",
    run: cleanTempFiles,
  }),
);
