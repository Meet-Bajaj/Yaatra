const express = require("express");
const router = express.Router();
const tripController = require("../controllers/trip.controller");

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
 *     summary: Create a trip
 *     tags: [Trip]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - driverId
 *               - origin
 *               - destination
 *               - distance
 *               - dipartureTime
 *               - totalSeats
 *               - pricePerSeat
 *             properties:
 *               driverId:
 *                 type: string
 *               origin:
 *                 type: array
 *                 items:
 *                   type: number
 *                 description: "[longitude, latitude]"
 *                 example: [79.0882, 21.1458]
 *               destination:
 *                 type: array
 *                 items:
 *                   type: number
 *                 description: "[longitude, latitude]"
 *                 example: [79.0900, 21.1500]
 *               distance:
 *                 type: number
 *                 example: 15.5
 *               dipartureTime:
 *                 type: string
 *                 format: date-time
 *               totalSeats:
 *                 type: integer
 *                 example: 3
 *               pricePerSeat:
 *                 type: number
 *                 example: 150
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully hit create trip route
 *   get:
 *     summary: Get all trips
 *     tags: [Trip]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Optional status filter (e.g. open)
 *     responses:
 *       200:
 *         description: Successfully hit get trips route
 */
router.post("/", tripController.createTrip);
router.get("/", tripController.getTrips);

/**
 * @swagger
 * /api/v1/trip/{id}:
 *   get:
 *     summary: Get a trip by ID
 *     tags: [Trip]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully hit get trip by id route
 */
router.get("/:id", tripController.getTripById);

/**
 * @swagger
 * /api/v1/trip/{id}/status:
 *   put:
 *     summary: Update trip status
 *     tags: [Trip]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully hit update trip status route
 */
router.put("/:id/status", tripController.updateTripStatus);

module.exports = router;
