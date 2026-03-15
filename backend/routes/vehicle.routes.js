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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - driverId
 *               - type
 *               - reg_number
 *               - capicity
 *             properties:
 *               driverId:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [CAR, RICKSHAW]
 *                 example: "RICKSHAW"
 *               reg_number:
 *                 type: string
 *                 example: "MH12AB1234"
 *               capicity:
 *                 type: integer
 *                 example: 3
 *               rcDocUrl:
 *                 type: string
 *               insuranceDocUrl:
 *                 type: string
 *               photoUrl:
 *                 type: string
 *               make:
 *                 type: string
 *                 example: "Bajaj"
 *               model:
 *                 type: string
 *                 example: "RE"
 *               year:
 *                 type: integer
 *                 example: 2022
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
