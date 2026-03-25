const { redisClient, isRedisReady } = require("../config/redis");
const logger = require("../utils/logger");

const initializeSockets = (io) => {
  const locationNamespace = io.of("/driver-location");

  locationNamespace.on("connection", (socket) => {
    logger.info("Socket connected", { socketId: socket.id, namespace: "/driver-location" });

    socket.on("register-driver", ({ driverId }) => {
      if (!driverId) {
        return;
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

      try {
        if (isRedisReady()) {
          await redisClient.geoAdd("driver_locations", {
            longitude: Number(longitude),
            latitude: Number(latitude),
            member: String(driverId),
          });
          await redisClient.setEx(`driver_status:${driverId}`, 3600, "online");
        }

        locationNamespace.to(`track_${driverId}`).emit("location-updated", {
          driverId: String(driverId),
          longitude: Number(longitude),
          latitude: Number(latitude),
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
