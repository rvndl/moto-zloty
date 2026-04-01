import { RedisClient } from "bun";
import { createLogger } from "../logger";

const redisLogger = createLogger("redis");

const redis = new RedisClient(Bun.env.REDIS_URL, {
  autoReconnect: true,
});

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

export { redis };
