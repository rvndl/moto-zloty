import { Elysia, t } from "elysia";
import { ErrorResponse } from "../models/common";
import { redis } from "../redis";
import { createLogger } from "../logger";

const API_URL = "https://eu1.locationiq.com/v1/autocomplete";
const MAX_RESULTS = 5;
const REDIS_KEY_PREFIX = "place-search";

const placeSearchLogger = createLogger("place-search");

interface LocationIQAddress {
  name?: string;
  house_number?: string;
  road?: string;
  neighbourhood?: string;
  suburb?: string;
  city?: string;
  state?: string;
}

interface LocationIQPlace {
  place_id: string;
  lat: string;
  lon: string;
  address: LocationIQAddress;
}

export const placeSearchRoute = new Elysia({
  name: "routes.placeSearch",
  prefix: "/placeSearch",
})
  .model({
    "common.error": ErrorResponse,
  })
  .get(
    "/:query",
    async ({ params, status }) => {
      const query = params.query.toLowerCase();
      const cacheKey = `${REDIS_KEY_PREFIX}:${query}`;

      try {
        const cached = await redis.get(cacheKey);
        if (cached) {
          return JSON.parse(cached) as LocationIQPlace[];
        }
      } catch (error) {
        placeSearchLogger.warn("Redis cache miss or error:", error);
      }

      const apiKey = Bun.env.LOCATION_IQ_API_KEY;
      if (!apiKey) {
        return status(500, { error: "LocationIQ API key not configured" });
      }

      const requestUrl = `${API_URL}?q=${encodeURIComponent(query)}&accept-language=pl&countrycodes=pl&limit=${MAX_RESULTS}&key=${apiKey}`;

      try {
        const response = await fetch(requestUrl);
        if (!response.ok) {
          placeSearchLogger.error(`LocationIQ API error: ${response.status}`);
          return status(500, {
            error: `Failed to search places: ${response.status}`,
          });
        }

        const places = (await response.json()) as LocationIQPlace[];

        try {
          await redis.set(cacheKey, JSON.stringify(places));
        } catch (error) {
          placeSearchLogger.warn("Failed to cache result:", error);
        }

        return places;
      } catch (error) {
        placeSearchLogger.error("Failed to search places:", error);

        return status(500, { error: "Nie udało się wyszukać miejsc" });
      }
    },
    {
      params: t.Object({
        query: t.String({ minLength: 1, description: "Place search query" }),
      }),
      response: {
        500: "common.error",
      },
      detail: {
        summary: "Search for places using LocationIQ",
        tags: ["Events"],
      },
    },
  );
