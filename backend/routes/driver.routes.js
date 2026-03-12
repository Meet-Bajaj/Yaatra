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
 *     responses:
 *       200:
 *         description: Successfully hit update driver status route
 */
router.put("/status", driverController.updateStatus);

module.exports = router;
