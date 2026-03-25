const express = require("express");
const { body, param } = require("express-validator");

const vehicleController = require("../controllers/vehicle.controller");
const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/roleMiddleware");
const { validate } = require("../middlewares/validate");

const router = express.Router();

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
 *     summary: Register a new vehicle
 *     tags: [Vehicle]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type]
 *             properties:
 *               driverId:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [CAR, RICKSHAW]
 *               registrationNumber:
 *                 type: string
 *               capacity:
 *                 type: integer
 *               rcDocUrl:
 *                 type: string
 *               insuranceDocUrl:
 *                 type: string
 *               photoUrl:
 *                 type: string
 *               make:
 *                 type: string
 *               model:
 *                 type: string
 *               year:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Vehicle registered
 */
router.post(
  "/register",
  protect,
  authorize("driver", "admin"),
  validate([
    body("driverId").optional().isMongoId(),
    body("type").isIn(["CAR", "RICKSHAW"]),
    body("registrationNumber").optional().isString().trim().notEmpty(),
    body("reg_number").optional().isString().trim().notEmpty(),
    body("capacity").optional().isInt({ min: 1 }),
    body("capicity").optional().isInt({ min: 1 }),
    body("rcDocUrl").optional().isURL(),
    body("insuranceDocUrl").optional().isURL(),
    body("photoUrl").optional().isURL(),
    body("make").optional().isString().trim(),
    body("model").optional().isString().trim(),
    body("year").optional().isInt({ min: 1980, max: 2100 }),
  ]),
  vehicleController.registerVehicle
);

/**
 * @swagger
 * /api/v1/vehicle/{id}:
 *   get:
 *     summary: Get vehicle details
 *     tags: [Vehicle]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vehicle details
 */
router.get(
  "/:id",
  validate([param("id").isMongoId()]),
  vehicleController.getVehicleDetails
);

module.exports = router;
