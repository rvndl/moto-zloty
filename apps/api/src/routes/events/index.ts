import { Elysia } from "elysia";
import { listRoutes } from "./list";
import { detailsRoutes } from "./details";
import { searchRoutes } from "./search";
import { publicRoutes } from "./public";
import { createRoutes } from "./create";
import { moderationRoutes } from "./moderation";

export const eventRoutes = new Elysia({
  name: "routes.events",
  prefix: "/events",
})
  .use(listRoutes)
  .use(detailsRoutes)
  .use(searchRoutes)
  .use(publicRoutes)
  .use(createRoutes)
  .use(moderationRoutes);
