const Driver = require("../models/driver");

const getDriverProfile = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : req.query.userId;
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID required" });
    }

    const driver = await Driver.findOne({ userId }).populate("userId", "name phone email avatarUrl").populate("vehicle");
    if (!driver) {
      return res.status(404).json({ success: false, message: "Driver profile not found for this user" });
    }

    res.status(200).json({ success: true, data: driver });
  } catch (error) {
    next(error);
  }
};

const updateLocation = async (req, res, next) => {
  try {
    const driverId = req.body.driverId || (req.user ? req.user.driverId : null);
    const { longitude, latitude } = req.body;

    if (!driverId || longitude === undefined || latitude === undefined) {
      return res.status(400).json({ success: false, message: "Driver ID, longitude, and latitude are required" });
    }

    const driver = await Driver.findByIdAndUpdate(
      driverId,
      {
        location: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
      },
      { new: true }
    );

    if (!driver) {
      return res.status(404).json({ success: false, message: "Driver not found" });
    }

    try {
       const { redisClient } = require("../config/redis");
       await redisClient.geoAdd("driver_locations", {
         longitude: parseFloat(longitude),
         latitude: parseFloat(latitude),
         member: driverId.toString(),
       });
       await redisClient.setEx(`driver_status:${driverId}`, 3600, "online");
    } catch (redisErr) {
       console.error("Redis REST geoAdd error:", redisErr);
    }

    res.status(200).json({ success: true, message: "Driver location updated", data: driver });
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const driverId = req.body.driverId || (req.user ? req.user.driverId : null);
    const { status } = req.body;

    if (!driverId || !status) {
      return res.status(400).json({ success: false, message: "Driver ID and status are required" });
    }

    if (!["offline", "online", "onTrip"].includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const driver = await Driver.findByIdAndUpdate(driverId, { status }, { new: true });
    
    if (!driver) {
      return res.status(404).json({ success: false, message: "Driver not found" });
    }

    res.status(200).json({ success: true, message: "Driver status updated", data: driver });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDriverProfile,
  updateLocation,
  updateStatus,
};
