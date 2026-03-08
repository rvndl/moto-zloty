import { Elysia } from "elysia";
import { modMiddleware } from "../../lib/auth";
import { ErrorResponse } from "../../models/common";
import { AccountService } from "../../services";

export const listRoute = new Elysia({
  name: "routes.mod.accounts",
  prefix: "/mod",
})
  .use(modMiddleware)
  .model({
    "common.error": ErrorResponse,
  })
  .get(
    "/accounts",
    async ({ status }) => {
      try {
        return await AccountService.listAll();
      } catch (err) {
        console.error("Failed to fetch accounts:", err);
        return status(500, {
          error: "Nie udało się pobrać listy użytkowników",
        });
      }
    },
    {
      response: {
        500: "common.error",
      },
      detail: {
        summary: "List all accounts (mod only)",
        tags: ["Moderation"],
      },
    },
  );
