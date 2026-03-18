import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { db } from "./db";
import { authRoutes } from "./routes/auth";
import { eventRoutes } from "./routes/events/index";
import { accountRoutes, modAccountsRoute } from "./routes/account/index";
import { fileRoutes } from "./routes/file/index";
import { contactRoute } from "./routes/contact";
import { placeSearchRoute } from "./routes/place-search";
import { bannerScrapRoute } from "./routes/banner-scrap";
import { modEventsRoute } from "./routes/events/moderation/index";
import { mapRoute, sitemapRoute } from "./routes/events/public/index";
import { cleanupJob } from "./jobs";
import openapi from "@elysiajs/openapi";
import { configure, getConsoleSink, getLogger } from "@logtape/logtape";
import { scraperRoute } from "./routes/scraper";

await configure({
  sinks: { console: getConsoleSink() },
  loggers: [{ category: "api", lowestLevel: "info", sinks: ["console"] }],
});

const app = new Elysia({ name: "app.main" })
  .use(cors())
  .use(
    openapi({
      documentation: {
        info: {
          title: "Moto-Zloty API",
          version: "1.0.0",
        },
        tags: [
          { name: "Auth", description: "Authentication endpoints" },
          { name: "Events", description: "Event management endpoints" },
          { name: "Files", description: "File upload and retrieval" },
          { name: "Contact", description: "Contact form" },
          { name: "Account", description: "User account management" },
          { name: "Moderation", description: "Moderation endpoints" },
        ],
      },
    }),
  )
  .decorate("db", db)

  .use(cleanupJob)

  .use(authRoutes)
  .use(eventRoutes)
  .use(accountRoutes)
  .use(modAccountsRoute)
  .use(modEventsRoute)
  .use(fileRoutes)
  .use(contactRoute)
  .use(placeSearchRoute)
  .use(bannerScrapRoute)
  .use(mapRoute)
  .use(sitemapRoute)
  .use(scraperRoute)
  .listen(Bun.env.PORT ?? 3000);

const logger = getLogger(["api", "main"]);

logger.info`API running at ${app.server?.hostname}:${app.server?.port}`;

export type App = typeof app;
