const express = require("express");
const { body } = require("express-validator");

const authController = require("../controllers/auth.controller");
const { authLimiter } = require("../middlewares/rateLimiter");
const { validate } = require("../middlewares/validate");

const router = express.Router();

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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [phone]
 *             properties:
 *               phone:
 *                 type: string
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [rider, driver]
 *     responses:
 *       201:
 *         description: Successfully registered
 */
router.post(
  "/register",
  authLimiter,
  validate([
    body("phone").isString().trim().notEmpty(),
    body("name").optional().isString().trim().isLength({ min: 2, max: 100 }),
    body("email").optional().isEmail(),
    body("password").optional().isLength({ min: 8 }),
    body("role").optional().isIn(["rider", "driver"]),
  ]),
  authController.register
);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Log in with phone number
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [phone]
 *             properties:
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent successfully or logged in
 */
router.post(
  "/login",
  authLimiter,
  validate([body("phone").isString().trim().notEmpty()]),
  authController.login
);

/**
 * @swagger
 * /api/v1/auth/verify-otp:
 *   post:
 *     summary: Verify OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [phone, code]
 *             properties:
 *               phone:
 *                 type: string
 *               code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully verified
 */
router.post(
  "/verify-otp",
  authLimiter,
  validate([
    body("phone").isString().trim().notEmpty(),
    body("code").isString().trim().isLength({ min: 4, max: 6 }),
  ]),
  authController.verifyOTP
);

module.exports = router;
