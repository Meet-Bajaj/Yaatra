const path = require("path");

const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const hpp = require("hpp");

const env = require("./config/env");
const setupSwagger = require("./swagger");
const { errorHandler, notFound } = require("./middlewares/errorHandler");
const { apiLimiter } = require("./middlewares/rateLimiter");
const requestLogger = require("./middlewares/requestLogger");
const routes = require("./routes");
const { sendSuccess } = require("./utils/apiResponse");

const helmetOptions = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      baseUri: ["'self'"],
      fontSrc: ["'self'", "https:", "data:"],
      formAction: ["'self'"],
      frameAncestors: ["'self'"],
      imgSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      scriptSrcAttr: ["'unsafe-inline'"],
      styleSrc: ["'self'", "https:", "'unsafe-inline'"],
      connectSrc: ["'self'", "http:", "https:"],
      upgradeInsecureRequests: null,
    },
  },
  crossOriginEmbedderPolicy: false,
};

const createCorsOptions = () => {
  if (env.corsOrigins.includes("*")) {
    return { origin: true, credentials: true };
  }

  return {
    origin(origin, callback) {
      if (
        !origin || 
        env.corsOrigins.includes(origin) || 
        origin === env.appBaseUrl
      ) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true,
  };
};

const createApp = () => {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", 1);

  app.use(requestLogger);
  app.use(helmet(helmetOptions));
  app.use(hpp());
  app.use(cors(createCorsOptions()));

  app.use("/api/v1/payment/webhook", express.raw({ type: "application/json" }));
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));

  app.use(
    "/uploads",
    express.static(path.join(__dirname, "public", "uploads"), {
      maxAge: env.isProduction ? "1d" : 0,
    })
  );

  setupSwagger(app);

  app.get("/", (req, res) => {
    sendSuccess(res, {
      message: "RickRide API is running",
      data: {
        docs: "/api-docs",
        health: "/health",
      },
    });
  });

  app.get("/health", (req, res) => {
    sendSuccess(res, {
      message: "Service healthy",
      data: {
        uptime: process.uptime(),
        environment: env.nodeEnv,
      },
    });
  });

  app.use("/api/v1", apiLimiter, routes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};

module.exports = {
  createApp,
};
