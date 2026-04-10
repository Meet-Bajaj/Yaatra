const Driver = require("../models/driver");
const { verifyToken } = require("../utils/jwt");
const { redisClient, isRedisReady } = require("../config/redis");
const logger = require("../utils/logger");

const initializeSockets = (io) => {
  const locationNamespace = io.of("/driver-location");

  locationNamespace.use((socket, next) => {
    try {
      const bearerToken = socket.handshake.auth?.token || socket.handshake.headers?.authorization;
      if (!bearerToken) {
        return next(new Error("Authentication token is required"));
      }

      const token = bearerToken.startsWith("Bearer ")
        ? bearerToken.slice(7)
        : bearerToken;

      const decoded = verifyToken(token);
      socket.data.user = {
        id: decoded.id,
        role: decoded.role,
      };

      return next();
    } catch (error) {
      return next(new Error("Invalid authentication token"));
    }
  });

  locationNamespace.on("connection", (socket) => {
    logger.info("Socket connected", { socketId: socket.id, namespace: "/driver-location" });

    socket.on("register-driver", async ({ driverId }) => {
      if (!driverId) {
        return;
      }

      if (!["driver", "admin"].includes(socket.data.user.role)) {
        socket.emit("socket-error", { message: "Only drivers can register location updates" });
        return;
      }

      if (socket.data.user.role !== "admin") {
        const driver = await Driver.findOne({ userId: socket.data.user.id }).select("_id");
        if (!driver) {
          socket.emit("socket-error", { message: "Driver profile not found" });
          return;
        }

        if (driver._id.toString() !== String(driverId)) {
          socket.emit("socket-error", { message: "Unauthorized driver registration" });
          return;
        }

        socket.data.driverId = driver._id.toString();
      } else {
        socket.data.driverId = String(driverId);
      }

      socket.join(`driver_${driverId}`);
      logger.info("Driver socket joined room", {
        socketId: socket.id,
        driverId,
      });
    });

    socket.on("track-driver", ({ driverId }) => {
      if (!driverId) {
        return;
      }

      socket.join(`track_${driverId}`);
      logger.info("Tracking room joined", {
        socketId: socket.id,
        driverId,
      });
    });

    socket.on("update-location", async ({ driverId, longitude, latitude }) => {
      if (!driverId || longitude === undefined || latitude === undefined) {
        return;
      }

      if (
        socket.data.user.role !== "admin" &&
        socket.data.driverId &&
        socket.data.driverId !== String(driverId)
      ) {
        socket.emit("socket-error", { message: "Unauthorized location update" });
        return;
      }

      const parsedLongitude = Number(longitude);
      const parsedLatitude = Number(latitude);
      if (
        !Number.isFinite(parsedLongitude) ||
        !Number.isFinite(parsedLatitude) ||
        parsedLatitude < -90 ||
        parsedLatitude > 90 ||
        parsedLongitude < -180 ||
        parsedLongitude > 180
      ) {
        socket.emit("socket-error", { message: "Invalid coordinates" });
        return;
      }

      try {
        if (isRedisReady()) {
          await redisClient.geoAdd("driver_locations", {
            longitude: parsedLongitude,
            latitude: parsedLatitude,
            member: String(driverId),
          });
          await redisClient.setEx(`driver_status:${driverId}`, 3600, "online");
        }

        locationNamespace.to(`track_${driverId}`).emit("location-updated", {
          driverId: String(driverId),
          longitude: parsedLongitude,
          latitude: parsedLatitude,
          timestamp: Date.now(),
        });
      } catch (error) {
        logger.error("Socket location update failed", error);
      }
    });

    socket.on("disconnect", () => {
      logger.info("Socket disconnected", { socketId: socket.id });
    });
  });
};

module.exports = {
  initializeSockets,
};
