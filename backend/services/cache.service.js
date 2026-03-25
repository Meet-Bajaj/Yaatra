const { redisClient, isRedisReady } = require("../config/redis");
const logger = require("../utils/logger");

const getJSON = async (key) => {
  if (!isRedisReady()) {
    return null;
  }

  try {
    const value = await redisClient.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    logger.warn("Redis getJSON failed", { key, message: error.message });
    return null;
  }
};

const setJSON = async (key, value, ttlSeconds = 60) => {
  if (!isRedisReady()) {
    return false;
  }

  try {
    await redisClient.set(key, JSON.stringify(value), {
      EX: ttlSeconds,
    });
    return true;
  } catch (error) {
    logger.warn("Redis setJSON failed", { key, message: error.message });
    return false;
  }
};

const deleteKey = async (key) => {
  if (!isRedisReady()) {
    return false;
  }

  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    logger.warn("Redis delete failed", { key, message: error.message });
    return false;
  }
};

module.exports = {
  deleteKey,
  getJSON,
  setJSON,
};
