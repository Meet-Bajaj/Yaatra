const express = require("express");
const { body, query } = require("express-validator");

const driverController = require("../controllers/driver.controller");
const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/roleMiddleware");
const { validate } = require("../middlewares/validate");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Driver
 *   description: Driver API routes
 */

/**
 * @swagger
 * /api/v1/driver/profile:
 *   post:
 *     summary: Create or update driver profile
 *     tags: [Driver]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [licenseNumber]
 *             properties:
 *               userId:
 *                 type: string
 *               licenseNumber:
 *                 type: string
 *               operatingZone:
 *                 type: string
 *               vehicleId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Driver profile created/updated
 */
router.post(
  "/profile",
  protect,
  authorize("driver", "admin"),
  validate([
    body("userId").optional().isMongoId(),
    body("licenseNumber").isString().trim().notEmpty(),
    body("operatingZone").optional().isString().trim(),
    body("vehicleId").optional({ nullable: true }).isMongoId(),
  ]),
  driverController.upsertDriverProfile
);

/**
 * @swagger
 * /api/v1/driver/profile:
 *   get:
 *     summary: Get driver profile
 *     tags: [Driver]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Driver profile data
 */
router.get("/profile", protect, authorize("driver", "admin"), driverController.getDriverProfile);

/**
 * @swagger
 * /api/v1/driver/location:
 *   put:
 *     summary: Update driver location
 *     tags: [Driver]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [longitude, latitude]
 *             properties:
 *               driverId:
 *                 type: string
 *               longitude:
 *                 type: number
 *               latitude:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [offline, online, onTrip]
 *     responses:
 *       200:
 *         description: Location updated successfully
 */
router.put(
  "/location",
  protect,
  authorize("driver", "admin"),
  validate([
    body("driverId").optional().isMongoId(),
    body("longitude").isFloat({ min: -180, max: 180 }),
    body("latitude").isFloat({ min: -90, max: 90 }),
    body("status").optional().isIn(["offline", "online", "onTrip"]),
  ]),
  driverController.updateLocation
);

/**
 * @swagger
 * /api/v1/driver/status:
 *   put:
 *     summary: Update driver status
 *     tags: [Driver]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               driverId:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [offline, online, onTrip]
 *     responses:
 *       200:
 *         description: Status updated successfully
 */
router.put(
  "/status",
  protect,
  authorize("driver", "admin"),
  validate([
    body("driverId").optional().isMongoId(),
    body("status").isIn(["offline", "online", "onTrip"]),
  ]),
  driverController.updateStatus
);

/**
 * @swagger
 * /api/v1/driver/nearby:
 *   get:
 *     summary: Get nearby drivers
 *     tags: [Driver]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: longitude
 *         schema:
 *           type: number
 *         required: true
 *       - in: query
 *         name: latitude
 *         schema:
 *           type: number
 *         required: true
 *       - in: query
 *         name: radiusKm
 *         schema:
 *           type: number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of nearby drivers
 */
router.get(
  "/nearby",
  protect,
  validate([
    query("longitude").isFloat({ min: -180, max: 180 }),
    query("latitude").isFloat({ min: -90, max: 90 }),
    query("radiusKm").optional().isFloat({ min: 0.1, max: 100 }),
    query("limit").optional().isInt({ min: 1, max: 50 }),
  ]),
  driverController.nearbyDrivers
);

module.exports = router;
