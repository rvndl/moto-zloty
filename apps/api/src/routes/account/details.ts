import { Elysia, t } from "elysia";
import { ErrorResponse } from "../../models/common";
import { AccountService } from "../../services";

export const detailsRoute = new Elysia({ name: "routes.account.details" })
  .model({
    "common.error": ErrorResponse,
  })
  .get(
    "/:id",
    async ({ params, status }) => {
      const result = await AccountService.getDetails(params.id);
      if (!result.success) {
        return status(404, { error: result.error });
      }

      const { account, events } = result.data;

      return {
        id: account.id,
        username: account.username,
        rank: account.rank,
        createdAt: account.createdAt,
        events: events.length > 0 ? events : undefined,
      };
    },
    {
      params: t.Object({
        id: t.String({ format: "uuid" }),
      }),
      response: {
        404: "common.error",
      },
      detail: {
        summary: "Get account details by ID",
        tags: ["Account"],
      },
    },
  );
