const Booking = require("../models/booking");
const Driver = require("../models/driver");
const Trip = require("../models/trip");
const asyncHandler = require("../middlewares/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const AppError = require("../utils/appError");

const createBooking = asyncHandler(async (req, res) => {
  const riderId = req.user.role === "admin" && req.body.riderId ? req.body.riderId : req.user._id;
  const seats = Number(req.body.seats || 1);

  let trip = null;
  if (req.body.tripId) {
    trip = await Trip.findById(req.body.tripId);
    if (!trip) {
      throw new AppError("Trip not found", 404);
    }

    if (trip.availableSeats < seats) {
      throw new AppError("Requested seats exceed trip availability", 400);
    }
  }

  if (!trip && req.body.autoDriverId) {
    const driver = await Driver.findById(req.body.autoDriverId);
    if (!driver) {
      throw new AppError("Driver not found", 404);
    }
  }

  if (!trip && !req.body.autoDriverId) {
    throw new AppError("Either tripId or autoDriverId is required", 400);
  }

  const fare =
    req.body.fare !== undefined
      ? Number(req.body.fare)
      : trip
        ? trip.pricePerSeat * seats
        : null;

  if (fare === null) {
    throw new AppError("Fare is required for direct driver bookings", 400);
  }

  const booking = await Booking.create({
    rider: riderId,
    trip: req.body.tripId || null,
    autoDriver: req.body.autoDriverId || null,
    seats,
    fare,
    paymentMethod: req.body.paymentMethod,
  });

  if (trip) {
    trip.availableSeats -= seats;
    if (trip.availableSeats === 0) {
      trip.status = "full";
    }
    await trip.save();
  }

  sendSuccess(res, {
    statusCode: 201,
    message: "Booking created successfully",
    data: booking,
  });
});

const getBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("rider", "name phone email")
    .populate("trip")
    .populate({
      path: "autoDriver",
      populate: [
        { path: "userId", select: "name phone email avatarUrl rating" },
        { path: "vehicle" },
      ],
    });

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  if (req.user.role !== "admin" && booking.rider._id.toString() !== req.user._id.toString()) {
    throw new AppError("You are not allowed to view this booking", 403);
  }

  sendSuccess(res, {
    data: booking,
  });
});

const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  if (req.user.role !== "admin" && booking.rider.toString() !== req.user._id.toString()) {
    throw new AppError("You are not allowed to cancel this booking", 403);
  }

  booking.status = "cancelled";
  booking.cancelledAt = new Date();
  await booking.save();

  if (booking.trip) {
    const trip = await Trip.findById(booking.trip);
    if (trip) {
      trip.availableSeats = Math.min(trip.totalSeats, trip.availableSeats + booking.seats);
      if (trip.status === "full" && trip.availableSeats > 0) {
        trip.status = "open";
      }
      await trip.save();
    }
  }

  sendSuccess(res, {
    message: "Booking cancelled successfully",
    data: booking,
  });
});

module.exports = {
  cancelBooking,
  createBooking,
  getBooking,
};
