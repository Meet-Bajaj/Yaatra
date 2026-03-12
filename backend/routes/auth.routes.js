const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication API routes
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successfully hit register route
 */
router.post("/register", authController.register);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login an existing user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successfully hit login route
 */
router.post("/login", authController.login);

/**
 * @swagger
 * /api/v1/auth/verify-otp:
 *   post:
 *     summary: Verify OTP
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successfully hit verify-otp route
 */
router.post("/verify-otp", authController.verifyOTP);

module.exports = router;
