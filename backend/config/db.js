const mongoose = require("mongoose");

const env = require("./env");
const logger = require("../utils/logger");

mongoose.set("strictQuery", true);

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    await mongoose.connect(env.mongo.uri, {
      dbName: env.mongo.dbName,
      autoIndex: !env.isProduction,
      serverSelectionTimeoutMS: 10000,
    });

    logger.info("MongoDB connected", {
      host: mongoose.connection.host,
      dbName: mongoose.connection.name,
    });

    return mongoose.connection;
  } catch (error) {
    logger.error("MongoDB connection failed", error);
    throw error;
  }
};

const disconnectDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    logger.info("MongoDB disconnected");
  }
};

module.exports = {
  connectDB,
  disconnectDB,
};
