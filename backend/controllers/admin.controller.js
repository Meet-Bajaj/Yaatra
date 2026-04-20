const Booking = require("../models/booking");
const Driver = require("../models/driver");
const Payment = require("../models/payment");
const Trip = require("../models/trip");
const User = require("../models/users");
const asyncHandler = require("../middlewares/asyncHandler");
const { getJSON, setJSON } = require("../services/cache.service");
const { sendSuccess } = require("../utils/apiResponse");
const AppError = require("../utils/appError");
const logger = require("../utils/logger");

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

const deleteUser = asyncHandler(async (req, res) => {
  const targetUser = await User.findById(req.params.id);
  if (!targetUser) {
    throw new AppError("User not found", 404);
  }

  if (targetUser.isDeleted) {
    throw new AppError("User is already deleted", 409);
  }

  if (targetUser.role === "admin") {
    throw new AppError("Admin users cannot be deleted via this endpoint", 403);
  }

  targetUser.isActive = false;
  targetUser.isDeleted = true;
  await targetUser.save();

  logger.info("User soft deleted by admin", {
    deletedUserId: targetUser._id,
    deletedByAdminId: req.user._id,
    role: targetUser.role,
    phone: targetUser.phone,
  });

  sendSuccess(res, {
    message: "User deleted successfully",
    data: {
      _id: targetUser._id,
      phone: targetUser.phone,
      role: targetUser.role,
      isActive: targetUser.isActive,
      isDeleted: targetUser.isDeleted,
    },
  });
});

module.exports = {
  adminStats,
  deleteUser,
};
