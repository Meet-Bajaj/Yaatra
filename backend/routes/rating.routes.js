const express = require("express");
const { body, param, query } = require("express-validator");

const ratingController = require("../controllers/rating.controller");
const { protect } = require("../middlewares/authMiddleware");
const { validate } = require("../middlewares/validate");

const router = express.Router();

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
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [driverId, rating]
 *             properties:
 *               driverId:
 *                 type: string
 *               rating:
 *                 type: integer
 *               comment:
 *                 type: string
 *               tripId:
 *                 type: string
 *               bookingId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Rating submitted
 */
router.post(
  "/",
  protect,
  validate([
    body("driverId").isMongoId(),
    body("rating").isInt({ min: 1, max: 5 }),
    body("comment").optional().isString().trim().isLength({ max: 500 }),
    body("tripId").optional().isMongoId(),
    body("bookingId").optional().isMongoId(),
  ]),
  ratingController.createRating
);

/**
 * @swagger
 * /api/v1/rating/{id}:
 *   get:
 *     summary: Get ratings for a driver
 *     tags: [Rating]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
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
 *         description: List of ratings
 */
router.get(
  "/:id",
  validate([
    param("id").isMongoId(),
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 100 }),
  ]),
  ratingController.getRatings
);

module.exports = router;
