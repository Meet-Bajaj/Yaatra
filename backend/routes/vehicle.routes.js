const express = require("express");
const router = express.Router();
const vehicleController = require("../controllers/vehicle.controller");

/**
 * @swagger
 * tags:
 *   name: Vehicle
 *   description: Vehicle API routes
 */

/**
 * @swagger
 * /api/v1/vehicle/register:
 *   post:
 *     summary: Register a vehicle
 *     tags: [Vehicle]
 *     responses:
 *       200:
 *         description: Successfully hit register vehicle route
 */
router.post("/register", vehicleController.registerVehicle);

/**
 * @swagger
 * /api/v1/vehicle/{id}:
 *   get:
 *     summary: Get vehicle details by ID
 *     tags: [Vehicle]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully hit get vehicle details route
 */
router.get("/:id", vehicleController.getVehicleDetails);

module.exports = router;
