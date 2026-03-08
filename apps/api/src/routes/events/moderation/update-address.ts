import { Elysia, t } from "elysia";
import { authMiddleware, isPermitted } from "../../../lib/auth";
import { AddressModel } from "../../../models/event";
import { ErrorResponse } from "../../../models/common";
import { EventService } from "../../../services";

export const updateAddressRoute = new Elysia({
  name: "routes.events.moderation.updateAddress",
})
  .use(authMiddleware)
  .model({
    "common.error": ErrorResponse,
    "event.address": AddressModel,
  })
  .patch(
    "/:id/updateAddress",
    async ({ params, body, user, status }) => {
      const result = await EventService.updateAddress(
        params.id,
        body,
        user.id,
        user.username,
        user.rank,
        isPermitted,
      );

      if (!result.success) {
        return status(result.statusCode as 403 | 404 | 500, {
          error: result.error,
        });
      }

      return result.data;
    },
    {
      params: t.Object({
        id: t.String({ format: "uuid" }),
      }),
      body: t.Object({
        address: t.Optional(AddressModel),
        latitude: t.Number(),
        longitude: t.Number(),
      }),
      response: {
        403: "common.error",
        404: "common.error",
        500: "common.error",
      },
      detail: {
        summary: "Update event address",
        tags: ["Events"],
      },
    },
  );
