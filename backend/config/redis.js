const { createClient } = require("redis");

const env = require("./env");
const logger = require("../utils/logger");

const redisClient = createClient({
  url: env.redis.url,
  socket: {
    reconnectStrategy(retries) {
      if (retries > 5) {
        return false;
      }

      return Math.min(retries * 200, 2000);
    },
  },
});

let connectionPromise = null;

redisClient.on("error", (error) => {
  if (redisClient.isReady) {
    logger.error("Redis client error", error);
  }
});

redisClient.on("connect", () => {
  logger.info("Redis client connected");
});

const connectRedis = async () => {
  if (redisClient.isReady || redisClient.isOpen) {
    return redisClient;
  }

  if (!connectionPromise) {
    connectionPromise = redisClient.connect().catch((error) => {
      logger.warn("Redis unavailable; continuing without cache/session acceleration.", {
        message: error.message,
      });
      return null;
    });
  }

  await connectionPromise;
  connectionPromise = null;
  return redisClient;
};

const isRedisReady = () => redisClient.isReady;

const disconnectRedis = async () => {
  if (redisClient.isOpen) {
    await redisClient.quit();
    logger.info("Redis client disconnected");
  }
};

module.exports = {
  redisClient,
  connectRedis,
  isRedisReady,
  disconnectRedis,
};
