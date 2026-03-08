import { Elysia } from "elysia";
import { carouselRoute } from "./carousel";
import { byStateRoute } from "./by-state";
import { relatedRoute } from "./related";

export { mapRoute } from "./map";
export { sitemapRoute } from "./sitemap";

export const publicRoutes = new Elysia({ name: "routes.events.public" })
  .use(carouselRoute)
  .use(byStateRoute)
  .use(relatedRoute);
