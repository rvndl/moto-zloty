import { eq } from "drizzle-orm";
import { db } from "../db";
import { file } from "../db/schema";
import { type ServiceResult, ok, err } from "./types";
import sharp from "sharp";
import { unlink } from "node:fs/promises";
import { join } from "node:path";

const UPLOAD_DIR = Bun.env.UPLOAD_DIR || "./uploads";
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export interface UploadedFile {
  id: string;
  path: string;
}

export interface UploadOptions {
  convertToWebp?: boolean;
  webpQuality?: number;
  maxWidth?: number;
  maxHeight?: number;
}

export abstract class FileService {
  static async upload(
    fileData: File,
    options: UploadOptions = {},
  ): Promise<ServiceResult<UploadedFile>> {
    const {
      convertToWebp = true,
      webpQuality = 80,
      maxWidth,
      maxHeight,
    } = options;

    if (fileData.size > MAX_FILE_SIZE) {
      return err(400, "Plik jest za duży (max 10MB)");
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/avif",
    ];

    if (!allowedTypes.includes(fileData.type)) {
      return err(400, "Nieobsługiwany typ pliku");
    }

    try {
      const buffer = await fileData.arrayBuffer();
      let outputBuffer: Buffer = Buffer.from(buffer);
      let extension = this.getExtension(fileData.type);

      if (convertToWebp && fileData.type.startsWith("image/")) {
        let processor = sharp(outputBuffer);

        if (maxWidth || maxHeight) {
          processor = processor.resize(maxWidth, maxHeight, {
            fit: "inside",
            withoutEnlargement: true,
          });
        }

        outputBuffer = await processor
          .webp({ quality: webpQuality })
          .toBuffer();
        extension = "webp";
      }

      const fileId = crypto.randomUUID();
      const fileName = `${fileId}.${extension}`;
      const filePath = join(UPLOAD_DIR, fileName);

      await Bun.write(filePath, outputBuffer);

      const [newFile] = await db
        .insert(file)
        .values({
          id: fileId,
          path: filePath,
          status: "temporary",
        })
        .returning();

      if (!newFile) {
        await unlink(filePath).catch(() => {});
        return err(500, "Wystąpił błąd podczas zapisywania pliku");
      }

      return ok({
        id: newFile.id,
        path: newFile.path,
      });
    } catch (error) {
      console.error("File upload error:", error);
      return err(500, "Wystąpił błąd podczas przetwarzania pliku");
    }
  }

  static async getById(
    fileId: string,
  ): Promise<ServiceResult<typeof file.$inferSelect>> {
    const [f] = await db
      .select()
      .from(file)
      .where(eq(file.id, fileId))
      .limit(1);

    if (!f) {
      return err(404, "Plik nie został znaleziony");
    }

    return ok(f);
  }

  static async delete(
    fileId: string,
  ): Promise<ServiceResult<{ success: boolean }>> {
    const fileResult = await this.getById(fileId);
    if (!fileResult.success) {
      return fileResult as ServiceResult<{ success: boolean }>;
    }

    try {
      await unlink(fileResult.data.path).catch(() => {});

      await db.delete(file).where(eq(file.id, fileId));

      return ok({ success: true });
    } catch (error) {
      console.error("File delete error:", error);
      return err(500, "Wystąpił błąd podczas usuwania pliku");
    }
  }

  static async markPermanent(
    fileId: string,
  ): Promise<ServiceResult<typeof file.$inferSelect>> {
    const [updatedFile] = await db
      .update(file)
      .set({ status: "permanent" })
      .where(eq(file.id, fileId))
      .returning();

    if (!updatedFile) {
      return err(404, "Plik nie został znaleziony");
    }

    return ok(updatedFile);
  }

  static async createFromPath(
    path: string,
    status: "temporary" | "permanent" = "temporary",
  ): Promise<ServiceResult<typeof file.$inferSelect>> {
    const [newFile] = await db
      .insert(file)
      .values({
        path,
        status,
      })
      .returning();

    if (!newFile) {
      return err(500, "Nie udało się zapisać rekordu pliku");
    }

    return ok(newFile);
  }

  private static getExtension(mimeType: string): string {
    const extensions: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/gif": "gif",
      "image/webp": "webp",
      "image/avif": "avif",
    };

    return extensions[mimeType] || "bin";
  }
}
