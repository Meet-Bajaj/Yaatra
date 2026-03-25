const express = require("express");
const { body } = require("express-validator");

const userController = require("../controllers/user.controller");
const { protect } = require("../middlewares/authMiddleware");
const { validate } = require("../middlewares/validate");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User API routes
 */

/**
 * @swagger
 * /api/v1/user/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 */
router.get("/profile", protect, userController.getUserProfile);

/**
 * @swagger
 * /api/v1/user/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               avatarUrl:
 *                 type: string
 *               fcmToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: User profile updated
 */
router.put(
  "/profile",
  protect,
  validate([
    body("name").optional().isString().trim().isLength({ min: 2, max: 100 }),
    body("email").optional().isEmail(),
    body("avatarUrl").optional().isURL(),
    body("fcmToken").optional().isString().trim().notEmpty(),
  ]),
  userController.updateUserProfile
);

module.exports = router;
