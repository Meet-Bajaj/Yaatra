const User = require("../models/users");
const Driver = require("../models/driver");
const Trip = require("../models/trip");
const Booking = require("../models/booking");

const adminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDrivers = await Driver.countDocuments();
    const totalTrips = await Trip.countDocuments();
    const totalBookings = await Booking.countDocuments();

    res.status(200).json({
      success: true,
      message: "Admin stats retrieved successfully",
      data: {
        totalUsers,
        totalDrivers,
        totalTrips,
        totalBookings,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  adminStats,
};
