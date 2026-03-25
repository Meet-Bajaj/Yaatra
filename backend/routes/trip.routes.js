const express = require("express");
const { body, param, query } = require("express-validator");

const tripController = require("../controllers/trip.controller");
const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/roleMiddleware");
const { validate } = require("../middlewares/validate");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Trip
 *   description: Trip API routes
 */

/**
 * @swagger
 * /api/v1/trip:
 *   post:
 *     summary: Create a new trip
 *     tags: [Trip]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [origin, destination, distance, totalSeats, pricePerSeat]
 *             properties:
 *               driverId:
 *                 type: string
 *               origin:
 *                 type: array
 *                 items:
 *                   type: number
 *               destination:
 *                 type: array
 *                 items:
 *                   type: number
 *               distance:
 *                 type: number
 *               departureTime:
 *                 type: string
 *                 format: date-time
 *               totalSeats:
 *                 type: integer
 *               pricePerSeat:
 *                 type: number
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Trip created
 */
router.post(
  "/",
  protect,
  authorize("driver", "admin"),
  validate([
    body("driverId").optional().isMongoId(),
    body("origin").isArray({ min: 2, max: 2 }),
    body("destination").isArray({ min: 2, max: 2 }),
    body("distance").isFloat({ min: 0 }),
    body("departureTime").optional().isISO8601(),
    body("dipartureTime").optional().isISO8601(),
    body("totalSeats").isInt({ min: 1 }),
    body("pricePerSeat").isFloat({ min: 0 }),
    body("notes").optional().isString().trim(),
  ]),
  tripController.createTrip
);

/**
 * @swagger
 * /api/v1/trip:
 *   get:
 *     summary: Get trips
 *     tags: [Trip]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [open, full, ongoing, completed, cancelled]
 *       - in: query
 *         name: driverId
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of trips
 */
router.get(
  "/",
  validate([
    query("status").optional().isIn(["open", "full", "ongoing", "completed", "cancelled"]),
    query("driverId").optional().isMongoId(),
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 100 }),
  ]),
  tripController.getTrips
);

/**
 * @swagger
 * /api/v1/trip/{id}:
 *   get:
 *     summary: Get trip by ID
 *     tags: [Trip]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trip details
 */
router.get(
  "/:id",
  validate([param("id").isMongoId()]),
  tripController.getTripById
);

/**
 * @swagger
 * /api/v1/trip/{id}/status:
 *   put:
 *     summary: Update trip status
 *     tags: [Trip]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [open, full, ongoing, completed, cancelled]
 *     responses:
 *       200:
 *         description: Trip status updated
 */
router.put(
  "/:id/status",
  protect,
  authorize("driver", "admin"),
  validate([
    param("id").isMongoId(),
    body("status").isIn(["open", "full", "ongoing", "completed", "cancelled"]),
  ]),
  tripController.updateTripStatus
);

module.exports = router;
