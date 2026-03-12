const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/booking.controller");

/**
 * @swagger
 * tags:
 *   name: Booking
 *   description: Booking API routes
 */

/**
 * @swagger
 * /api/v1/booking:
 *   post:
 *     summary: Create a booking
 *     tags: [Booking]
 *     responses:
 *       200:
 *         description: Successfully hit create booking route
 */
router.post("/", bookingController.createBooking);

/**
 * @swagger
 * /api/v1/booking/{id}:
 *   get:
 *     summary: Get a booking by ID
 *     tags: [Booking]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully hit get booking route
 */
router.get("/:id", bookingController.getBooking);

/**
 * @swagger
 * /api/v1/booking/{id}/cancel:
 *   post:
 *     summary: Cancel a booking
 *     tags: [Booking]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully hit cancel booking route
 */
router.post("/:id/cancel", bookingController.cancelBooking);

module.exports = router;
