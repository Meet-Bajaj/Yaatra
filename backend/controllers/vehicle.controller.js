const Driver = require("../models/driver");
const Vehicle = require("../models/vehicle");
const asyncHandler = require("../middlewares/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const AppError = require("../utils/appError");

const resolveDriverId = async (req) => {
  if (req.body.driverId) {
    return req.body.driverId;
  }

  const driver = await Driver.findOne({ userId: req.user._id });
  return driver ? driver._id : null;
};

const registerVehicle = asyncHandler(async (req, res) => {
  const driverId = await resolveDriverId(req);
  if (!driverId) {
    throw new AppError("Driver profile is required before registering a vehicle", 400);
  }

  const driver = await Driver.findById(driverId);
  if (!driver) {
    throw new AppError("Driver not found", 404);
  }

  const payload = {
    driver: driverId,
    type: req.body.type,
    registrationNumber: req.body.registrationNumber || req.body.reg_number,
    capacity: req.body.capacity || req.body.capicity,
    rcDocUrl: req.body.rcDocUrl,
    insuranceDocUrl: req.body.insuranceDocUrl,
    photoUrl: req.body.photoUrl,
    make: req.body.make,
    model: req.body.model,
    year: req.body.year,
  };

  const vehicle = await Vehicle.findOneAndUpdate({ driver: driverId }, payload, {
    upsert: true,
    new: true,
    runValidators: true,
    setDefaultsOnInsert: true,
  }).populate("driver");

  driver.vehicle = vehicle._id;
  await driver.save();

  sendSuccess(res, {
    statusCode: 201,
    message: "Vehicle registered successfully",
    data: vehicle,
  });
});

const getVehicleDetails = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id).populate({
    path: "driver",
    populate: {
      path: "userId",
      select: "name phone email",
    },
  });

  if (!vehicle) {
    throw new AppError("Vehicle not found", 404);
  }

  sendSuccess(res, {
    data: vehicle,
  });
});

module.exports = {
  getVehicleDetails,
  registerVehicle,
};
