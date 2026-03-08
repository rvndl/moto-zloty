import { Elysia, t } from "elysia";
import { createClient } from "redis";
import { ErrorResponse } from "../models/common";

const API_URL = "https://eu1.locationiq.com/v1/autocomplete";
const MAX_RESULTS = 5;
const REDIS_KEY_PREFIX = "place-search";

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

let redisClient: ReturnType<typeof createClient> | null = null;

async function getRedisClient() {
  if (!redisClient) {
    const redisUrl = Bun.env.REDIS_URL || "redis://localhost:6379";
    redisClient = createClient({ url: redisUrl });
    redisClient.on("error", (err) => console.error("Redis error:", err));
    await redisClient.connect();
  }
  return redisClient;
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
        const redis = await getRedisClient();
        const cached = await redis.get(cacheKey);
        if (cached) {
          return JSON.parse(cached) as LocationIQPlace[];
        }
      } catch (error) {
        console.warn("Redis cache miss or error:", error);
      }

      const apiKey = Bun.env.LOCATION_IQ_API_KEY;
      if (!apiKey) {
        return status(500, { error: "LocationIQ API key not configured" });
      }

      const requestUrl = `${API_URL}?q=${encodeURIComponent(query)}&accept-language=pl&countrycodes=pl&limit=${MAX_RESULTS}&key=${apiKey}`;

      try {
        const response = await fetch(requestUrl);
        if (!response.ok) {
          console.error(`LocationIQ API error: ${response.status}`);
          return status(500, {
            error: `Failed to search places: ${response.status}`,
          });
        }

        const places = (await response.json()) as LocationIQPlace[];

        try {
          const redis = await getRedisClient();
          await redis.set(cacheKey, JSON.stringify(places));
        } catch (error) {
          console.warn("Failed to cache result:", error);
        }

        return places;
      } catch (error) {
        console.error("Failed to search places:", error);

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
