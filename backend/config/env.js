const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, "..", ".env"),
});

const parseNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseList = (value, fallback = []) => {
  if (!value) {
    return fallback;
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const resolvedPort = parseNumber(process.env.PORT, 5000);

module.exports = Object.freeze({
  nodeEnv: process.env.NODE_ENV || "development",
  isProduction: process.env.NODE_ENV === "production",
  port: resolvedPort,
  appBaseUrl: process.env.APP_BASE_URL || `http://localhost:${resolvedPort}`,
  corsOrigins: parseList(process.env.CORS_ORIGIN, ["*"]),
  mongo: {
    uri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/RickRide",
    dbName: process.env.MONGO_DB_NAME || undefined,
  },
  redis: {
    url: process.env.REDIS_URL || process.env.REDIS_URI || "redis://127.0.0.1:6379",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "change-me-in-production",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },
  rateLimit: {
    windowMs: parseNumber(process.env.RATE_LIMIT_WINDOW_MS, 60 * 1000),
    max: parseNumber(process.env.RATE_LIMIT_MAX, 120),
    authMax: parseNumber(process.env.AUTH_RATE_LIMIT_MAX, 10),
  },
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID || "",
    authToken: process.env.TWILIO_AUTH_TOKEN || "",
    verifyServiceSid: process.env.TWILIO_SERVICE_SID || "",
    phoneNumber: process.env.TWILIO_PHONE_NUMBER || "",
  },
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || "",
    keySecret: process.env.RAZORPAY_KEY_SECRET || "",
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || "",
  },
  firebase: {
    serviceAccountJson: process.env.FIREBASE_SERVICE_ACCOUNT_JSON || "",
    projectId: process.env.FIREBASE_PROJECT_ID || "",
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || "",
    privateKey: process.env.FIREBASE_PRIVATE_KEY
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
      : "",
    databaseUrl: process.env.FIREBASE_DATABASE_URL || "",
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "",
  },
  uploads: {
    maxFileSize: parseNumber(process.env.MAX_UPLOAD_SIZE_MB, 5) * 1024 * 1024,
  },
  logs: {
    level: process.env.LOG_LEVEL || (process.env.NODE_ENV === "production" ? "info" : "debug"),
  },
});
