const express = require("express");
const router = express.Router();
const ratingController = require("../controllers/rating.controller");

/**
 * @swagger
 * tags:
 *   name: Rating
 *   description: Rating API routes
 */

/**
 * @swagger
 * /api/v1/rating:
 *   post:
 *     summary: Create a rating
 *     tags: [Rating]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - driverId
 *               - rating
 *             properties:
 *               userId:
 *                 type: string
 *               driverId:
 *                 type: string
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: "Great ride!"
 *               tripId:
 *                 type: string
 *               bookingId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully hit create rating route
 */
router.post("/", ratingController.createRating);

/**
 * @swagger
 * /api/v1/rating/{id}:
 *   get:
 *     summary: Get ratings by ID
 *     tags: [Rating]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully hit get ratings route
 */
router.get("/:id", ratingController.getRatings);

module.exports = router;
