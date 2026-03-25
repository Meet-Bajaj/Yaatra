const express = require("express");

const adminRoutes = require("./admin.routes");
const authRoutes = require("./auth.routes");
const bookingRoutes = require("./booking.routes");
const driverRoutes = require("./driver.routes");
const paymentRoutes = require("./payment.routes");
const ratingRoutes = require("./rating.routes");
const tripRoutes = require("./trip.routes");
const uploadRoutes = require("./upload.routes");
const userRoutes = require("./user.route");
const vehicleRoutes = require("./vehicle.routes");

const router = express.Router();

router.use("/admin", adminRoutes);
router.use("/auth", authRoutes);
router.use("/booking", bookingRoutes);
router.use("/driver", driverRoutes);
router.use("/payment", paymentRoutes);
router.use("/rating", ratingRoutes);
router.use("/trip", tripRoutes);
router.use("/upload", uploadRoutes);
router.use("/user", userRoutes);
router.use("/vehicle", vehicleRoutes);

module.exports = router;
