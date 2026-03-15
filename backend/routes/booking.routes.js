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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - riderId
 *               - fare
 *               - paymentMethod
 *             properties:
 *               riderId:
 *                 type: string
 *               tripId:
 *                 type: string
 *               autoDriverId:
 *                 type: string
 *               seats:
 *                 type: integer
 *                 example: 1
 *               fare:
 *                 type: number
 *                 example: 25.50
 *               paymentMethod:
 *                 type: string
 *                 enum: [RAZORPAY, CASH, WALLET]
 *                 example: "CASH"
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
