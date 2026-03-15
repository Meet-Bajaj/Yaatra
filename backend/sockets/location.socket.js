const logger = require("../utils/logger");
const Driver = require("../models/driver");

const initializeSockets = (io) => {
  // Namespace for driver location tracking
  const nspLocation = io.of("/driver-location");

  nspLocation.on("connection", (socket) => {
    logger.info(`New driver socket connected: ${socket.id}`);

    // Expect drivers to "authenticate" and join their personal tracking room
    socket.on("register-driver", async (data) => {
      const { driverId } = data;
      if (driverId) {
        socket.join(`driver_${driverId}`);
        logger.info(`Socket ${socket.id} joined room: driver_${driverId}`);
      }
    });

    // Real-time location updates emitted by active drivers
    socket.on("update-location", async (data) => {
      const { driverId, longitude, latitude } = data;
      if (driverId && longitude && latitude) {
        try {
          // Perform quick Redis cache or DB update
          await Driver.findByIdAndUpdate(driverId, {
            location: {
               type: "Point",
               coordinates: [longitude, latitude]
            }
          });

          // Broadcast to any riders tracking this specific driver
          nspLocation.to(`track_${driverId}`).emit("location-updated", {
            driverId,
            longitude,
            latitude,
            timestamp: Date.now(),
          });
        } catch (err) {
          logger.error("Socket DB Update error:", err);
        }
      }
    });

    // Handle rider joining a room to track a specific driver
    socket.on("track-driver", (data) => {
       const { driverId } = data;
       if (driverId) {
          socket.join(`track_${driverId}`);
          logger.info(`Rider mapping socket ${socket.id} tracking driver_${driverId}`);
       }
    });

    socket.on("disconnect", () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  });
};

module.exports = {
  initializeSockets,
};
