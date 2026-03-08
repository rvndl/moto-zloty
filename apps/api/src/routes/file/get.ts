import { Elysia } from "elysia";
import { FileIdParams } from "../../models/file";
import { ErrorResponse } from "../../models/common";
import { FileService } from "../../services";

export const getRoute = new Elysia({ name: "routes.file.get" })
  .model({
    "file.params.id": FileIdParams,
    "common.error": ErrorResponse,
  })
  .get(
    "/:id",
    async ({ params, status, set }) => {
      const result = await FileService.getById(params.id);

      if (!result.success) {
        return status(404, { error: result.error });
      }

      const fileContent = Bun.file(result.data.path);
      if (!(await fileContent.exists())) {
        return status(404, { error: "Plik nie istnieje na dysku" });
      }

      set.headers["Cache-Control"] = "public, max-age=172800";
      set.headers["Content-Type"] = fileContent.type;

      return fileContent;
    },
    {
      params: "file.params.id",
      response: {
        404: "common.error",
      },
      detail: {
        summary: "Get file by ID",
        tags: ["Files"],
      },
    },
  );
