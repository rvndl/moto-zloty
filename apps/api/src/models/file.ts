import { t } from "elysia";

export const FileUploadBody = t.Object({
  file: t.File({
    type: ["image/png", "image/jpeg", "image/webp", "image/jpg"],
    maxSize: "4m",
  }),
});

export const FileIdParams = t.Object({
  id: t.String({ format: "uuid", description: "File ID" }),
});

export const FileUploadResponse = t.Object({
  full_id: t.String({ format: "uuid", description: "Full size image ID" }),
  small_id: t.String({ format: "uuid", description: "Small thumbnail ID" }),
});

export type FileUploadBodyType = typeof FileUploadBody.static;
export type FileUploadResponseType = typeof FileUploadResponse.static;
