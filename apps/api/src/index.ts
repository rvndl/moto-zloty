import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { cleanupJob } from "./jobs";
import openapi from "@elysiajs/openapi";
import { createLogger } from "./logger";
import { redis } from "./redis";
import { db } from "@db";
import {
  accountRoutes,
  authRoutes,
  bannerScrapRoute,
  contactRoute,
  eventRoutes,
  fileRoutes,
  modAccountsRoute,
  placeSearchRoute,
  publishWeeklyEventsRoute,
  socialMediaRoute,
} from "@routes";
import { modEventsRoute } from "@routes/events/moderation";
import { mapRoute, sitemapRoute } from "@routes/events/public";
import { scraperRoute } from "@routes/scraper";

const elysiaLogger = createLogger("elysia");

await redis.connect();

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
  .use(socialMediaRoute)
  .use(publishWeeklyEventsRoute)
  .listen(Bun.env.PORT ?? 3000);

elysiaLogger.info(`API running at ${app.server?.hostname}:${app.server?.port}`);

export type App = typeof app;
