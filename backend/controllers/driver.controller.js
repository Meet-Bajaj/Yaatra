const Driver = require("../models/driver");
const asyncHandler = require("../middlewares/asyncHandler");
const { redisClient, isRedisReady } = require("../config/redis");
const { findNearbyDrivers } = require("../services/matching.service");
const { sendSuccess } = require("../utils/apiResponse");
const AppError = require("../utils/appError");

const resolveDriver = async (req, explicitDriverId) => {
  if (explicitDriverId) {
    return Driver.findById(explicitDriverId);
  }

  return Driver.findOne({ userId: req.user._id });
};

const upsertDriverProfile = asyncHandler(async (req, res) => {
  const userId = req.user.role === "admin" && req.body.userId ? req.body.userId : req.user._id;
  const payload = {
    licenseNumber: req.body.licenseNumber,
    operatingZone: req.body.operatingZone,
  };

  if (req.body.vehicleId !== undefined) {
    payload.vehicle = req.body.vehicleId || null;
  }

  const driver = await Driver.findOneAndUpdate(
    { userId },
    payload,
    {
      upsert: true,
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  )
    .populate("userId", "name phone email avatarUrl rating")
    .populate("vehicle");

  sendSuccess(res, {
    statusCode: 201,
    message: "Driver profile saved successfully",
    data: driver,
  });
});

const getDriverProfile = asyncHandler(async (req, res) => {
  const userId =
    req.user.role === "admin" && req.query.userId
      ? req.query.userId
      : req.user._id;

  const driver = await Driver.findOne({ userId })
    .populate("userId", "name phone email avatarUrl rating fcmToken")
    .populate("vehicle");
  
  if (!driver) {
    throw new AppError("Driver profile not found", 404);
  }

  sendSuccess(res, {
    data: driver,
  });
});
const updateLocation = asyncHandler(async (req, res) => {
  const driver = await resolveDriver(req, req.body.driverId);
  if (!driver) {
    throw new AppError("Driver not found", 404);
  }

  const longitude = Number(req.body.longitude);
  const latitude = Number(req.body.latitude);

  driver.location = {
    type: "Point",
    coordinates: [longitude, latitude],
  };
  driver.status = req.body.status || "online";
  await driver.save();

  if (isRedisReady()) {
    await redisClient.geoAdd("driver_locations", {
      longitude,
      latitude,
      member: driver._id.toString(),
    });
    await redisClient.setEx(`driver_status:${driver._id}`, 3600, driver.status);
  }

  const io = req.app.get("io");
  if (io) {
    io.of("/driver-location").to(`track_${driver._id}`).emit("location-updated", {
      driverId: driver._id.toString(),
      longitude,
      latitude,
      timestamp: Date.now(),
    });
  }

  sendSuccess(res, {
    message: "Driver location updated",
    data: driver,
  });
});

const updateStatus = asyncHandler(async (req, res) => {
  const driver = await resolveDriver(req, req.body.driverId);
  if (!driver) {
    throw new AppError("Driver not found", 404);
  }

  driver.status = req.body.status;
  await driver.save();

  if (isRedisReady()) {
    await redisClient.setEx(`driver_status:${driver._id}`, 3600, driver.status);
  }

  sendSuccess(res, {
    message: "Driver status updated",
    data: driver,
  });
});

const nearbyDrivers = asyncHandler(async (req, res) => {
  const longitude = Number(req.query.longitude);
  const latitude = Number(req.query.latitude);
  const radiusKm = Number(req.query.radiusKm || 5);
  const limit = Number(req.query.limit || 10);

  const drivers = await findNearbyDrivers([longitude, latitude], radiusKm, limit);

  sendSuccess(res, {
    data: drivers,
    meta: {
      count: drivers.length,
      radiusKm,
      limit,
    },
  });
});

module.exports = {
  getDriverProfile,
  nearbyDrivers,
  updateLocation,
  updateStatus,
  upsertDriverProfile,
};
