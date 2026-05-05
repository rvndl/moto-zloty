import Elysia from "elysia";
import { modMiddleware } from "../../lib";
import { scrapRoute } from "./scrap";
import { listRoute } from "./list";
import { setSeenRoute } from "./set-seen";
import { importImageRoute } from "./import-image";

export const scraperRoute = new Elysia({
  name: "routes.scraper",
  prefix: "/scraper",
})
  .use(modMiddleware)
  .use(scrapRoute)
  .use(listRoute)
  .use(setSeenRoute)
  .use(importImageRoute);
