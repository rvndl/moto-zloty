import { RedisClient, type RedisOptions } from "bun";
import { createLogger } from "../logger";
import { BunRedisStore } from "@nowarajs/kv-store/bun-redis";

const OPTIONS: RedisOptions = {
  autoReconnect: true,
};

const redisLogger = createLogger("redis");

const redisStore = new BunRedisStore(Bun.env.REDIS_URL, OPTIONS);
const redis = new RedisClient(Bun.env.REDIS_URL, OPTIONS);

redis.onconnect = () => {
  redisLogger.info("Connected to Redis");
};

redis.onclose = (error) => {
  if (error) {
    redisLogger.error("Redis connection closed with error:", error);
  } else {
    redisLogger.warn("Redis connection closed");
  }
};

export { redis, redisStore };
