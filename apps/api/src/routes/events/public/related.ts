import { Elysia, t } from "elysia";
import { EventService } from "../../../services";

export const relatedRoute = new Elysia({
  name: "routes.events.public.related",
}).get(
  "/:id/listRelated/:month/:state",
  async ({ params }) => {
    const { id, month, state } = params;
    return await EventService.getRelated(id, parseInt(month), state);
  },
  {
    params: t.Object({
      id: t.String({ format: "uuid" }),
      month: t.String(),
      state: t.String(),
    }),
    detail: {
      summary: "Get related events by month and state",
      tags: ["Events"],
    },
  },
);
