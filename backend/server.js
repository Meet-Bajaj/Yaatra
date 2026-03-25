const http = require("http");

const { Server } = require("socket.io");

const { createApp } = require("./app");
const { connectDB } = require("./config/db");
const env = require("./config/env");
const { connectRedis } = require("./config/redis");
const { initializeSockets } = require("./sockets/location.socket");
const logger = require("./utils/logger");

const app = createApp();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: env.corsOrigins.includes("*") ? true : env.corsOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

app.set("io", io);
initializeSockets(io);

const startServer = async () => {
  await connectDB();
  await connectRedis();

  server.listen(env.port, () => {
    logger.info("Server started", {
      port: env.port,
      baseUrl: env.appBaseUrl,
      docsUrl: `${env.appBaseUrl}/api-docs`,
    });
  });
};

const shutdown = async (signal) => {
  logger.info(`Received ${signal}, shutting down gracefully`);

  server.close(() => {
    logger.info("HTTP server closed");
    process.exit(0);
  });

  setTimeout(() => {
    logger.error("Forced shutdown after timeout");
    process.exit(1);
  }, 10000).unref();
};

["SIGINT", "SIGTERM"].forEach((signal) => {
  process.on(signal, () => shutdown(signal));
});

startServer().catch((error) => {
  logger.error("Application failed to start", error);
  process.exit(1);
});
