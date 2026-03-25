const express = require("express");
const { body, param } = require("express-validator");

const bookingController = require("../controllers/booking.controller");
const { protect } = require("../middlewares/authMiddleware");
const { validate } = require("../middlewares/validate");

const router = express.Router();

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
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [paymentMethod]
 *             properties:
 *               riderId:
 *                 type: string
 *               tripId:
 *                 type: string
 *               autoDriverId:
 *                 type: string
 *               seats:
 *                 type: integer
 *               fare:
 *                 type: number
 *               paymentMethod:
 *                 type: string
 *                 enum: [RAZORPAY, CASH, WALLET]
 *     responses:
 *       201:
 *         description: Booking created
 */
router.post(
  "/",
  protect,
  validate([
    body("riderId").optional().isMongoId(),
    body("tripId").optional().isMongoId(),
    body("autoDriverId").optional().isMongoId(),
    body("seats").optional().isInt({ min: 1 }),
    body("fare").optional().isFloat({ min: 0 }),
    body("paymentMethod").isIn(["RAZORPAY", "CASH", "WALLET"]),
  ]),
  bookingController.createBooking
);

/**
 * @swagger
 * /api/v1/booking/{id}:
 *   get:
 *     summary: Get booking details
 *     tags: [Booking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking details
 */
router.get(
  "/:id",
  protect,
  validate([param("id").isMongoId()]),
  bookingController.getBooking
);

/**
 * @swagger
 * /api/v1/booking/{id}/cancel:
 *   post:
 *     summary: Cancel a booking
 *     tags: [Booking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking cancelled
 */
router.post(
  "/:id/cancel",
  protect,
  validate([param("id").isMongoId()]),
  bookingController.cancelBooking
);

module.exports = router;
