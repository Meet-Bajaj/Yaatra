const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/booking.controller");

router.post("/", bookingController.createBooking);
router.get("/:id", bookingController.getBooking);
router.post("/:id/cancel", bookingController.cancelBooking);

module.exports = router;
