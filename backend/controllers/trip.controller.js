const Driver = require("../models/driver");
const Trip = require("../models/trip");
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

const createTrip = asyncHandler(async (req, res) => {
  const driverId = await resolveDriverId(req);
  if (!driverId) {
    throw new AppError("Driver profile is required before creating a trip", 400);
  }

  const totalSeats = Number(req.body.totalSeats);

  const trip = await Trip.create({
    driver: driverId,
    origin: { type: "Point", coordinates: req.body.origin },
    destination: { type: "Point", coordinates: req.body.destination },
    distance: Number(req.body.distance),
    departureTime: req.body.departureTime || req.body.dipartureTime,
    totalSeats,
    availableSeats: totalSeats,
    pricePerSeat: Number(req.body.pricePerSeat),
    notes: req.body.notes,
  });

  sendSuccess(res, {
    statusCode: 201,
    message: "Trip created successfully",
    data: trip,
  });
});

const getTrips = asyncHandler(async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.status) {
    filter.status = req.query.status;
  }
  if (req.query.driverId) {
    filter.driver = req.query.driverId;
  }

  const [trips, totalCount] = await Promise.all([
    Trip.find(filter)
      .sort({ departureTime: 1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "driver",
        populate: [
          { path: "userId" },
          { path: "vehicle" },
        ],
      }),
    Trip.countDocuments(filter),
  ]);

  sendSuccess(res, {
    data: trips,
    meta: {
      count: trips.length,
      total: totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit) || 1,
    },
  });
});

const getTripById = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id).populate({
    path: "driver",
    populate: [
      { path: "userId" },
      { path: "vehicle" },
    ],
  });

  if (!trip) {
    throw new AppError("Trip not found", 404);
  }

  sendSuccess(res, {
    data: trip,
  });
});

const updateTripStatus = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id);
  if (!trip) {
    throw new AppError("Trip not found", 404);
  }

  if (req.user.role !== "admin") {
    const driver = await Driver.findOne({ userId: req.user._id });
    if (!driver || driver._id.toString() !== trip.driver.toString()) {
      throw new AppError("You are not allowed to modify this trip", 403);
    }
  }

  trip.status = req.body.status;
  await trip.save();

  sendSuccess(res, {
    message: "Trip status updated",
    data: trip,
  });
});

module.exports = {
  createTrip,
  getTripById,
  getTrips,
  updateTripStatus,
};
