const express = require("express");
const router = express.Router();
const driverController = require("../controllers/driver.controller");

/**
 * @swagger
 * tags:
 *   name: Driver
 *   description: Driver API routes
 */

/**
 * @swagger
 * /api/v1/driver/profile:
 *   get:
 *     summary: Get driver profile
 *     tags: [Driver]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Query parameter for userId (if not using auth token)
 *     responses:
 *       200:
 *         description: Successfully hit get driver profile route
 */
router.get("/profile", driverController.getDriverProfile);

/**
 * @swagger
 * /api/v1/driver/location:
 *   put:
 *     summary: Update driver location
 *     tags: [Driver]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - longitude
 *               - latitude
 *             properties:
 *               driverId:
 *                 type: string
 *                 description: Provide if not using auth token
 *               longitude:
 *                 type: number
 *                 example: 79.0882
 *               latitude:
 *                 type: number
 *                 example: 21.1458
 *     responses:
 *       200:
 *         description: Successfully hit update driver location route
 */
router.put("/location", driverController.updateLocation);

/**
 * @swagger
 * /api/v1/driver/status:
 *   put:
 *     summary: Update driver status
 *     tags: [Driver]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               driverId:
 *                 type: string
 *                 description: Provide if not using auth token
 *               status:
 *                 type: string
 *                 enum: [offline, online, onTrip]
 *                 example: "online"
 *     responses:
 *       200:
 *         description: Successfully hit update driver status route
 */
router.put("/status", driverController.updateStatus);

module.exports = router;
