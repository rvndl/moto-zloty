import { Elysia } from "elysia";
import { getRoute } from "./get";
import { uploadRoute } from "./upload";

export const fileRoutes = new Elysia({ name: "routes.file", prefix: "/file" })
  .use(getRoute)
  .use(uploadRoute);
