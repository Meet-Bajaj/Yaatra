const Booking = require("../models/booking");
const Driver = require("../models/driver");
const Payment = require("../models/payment");
const Trip = require("../models/trip");
const User = require("../models/users");
const asyncHandler = require("../middlewares/asyncHandler");
const { getJSON, setJSON } = require("../services/cache.service");
const { sendSuccess } = require("../utils/apiResponse");

const adminStats = asyncHandler(async (req, res) => {
  const cacheKey = "admin:stats";
  const cachedStats = await getJSON(cacheKey);
  if (cachedStats) {
    return sendSuccess(res, {
      message: "Admin stats retrieved successfully",
      data: cachedStats,
    });
  }

  const [totalUsers, totalDrivers, totalTrips, totalBookings, totalPayments] = await Promise.all([
    User.countDocuments(),
    Driver.countDocuments(),
    Trip.countDocuments(),
    Booking.countDocuments(),
    Payment.countDocuments(),
  ]);

  const stats = {
    totalUsers,
    totalDrivers,
    totalTrips,
    totalBookings,
    totalPayments,
  };

  await setJSON(cacheKey, stats, 30);

  sendSuccess(res, {
    message: "Admin stats retrieved successfully",
    data: stats,
  });
});

module.exports = {
  adminStats,
};
