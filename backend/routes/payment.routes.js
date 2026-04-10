const express = require("express");
const { body } = require("express-validator");

const paymentController = require("../controllers/payment.controller");
const { protect } = require("../middlewares/authMiddleware");
const { webhookLimiter } = require("../middlewares/rateLimiter");
const { validate } = require("../middlewares/validate");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Payment
 *   description: Payment API routes
 */

/**
 * @swagger
 * /api/v1/payment/create:
 *   post:
 *     summary: Create a payment
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [bookingId]
 *             properties:
 *               bookingId:
 *                 type: string
 *               amount:
 *                 type: number
 *               gateway:
 *                 type: string
 *                 enum: [RAZORPAY, CASH, WALLET]
 *     responses:
 *       201:
 *         description: Payment created
 */
router.post(
  "/create",
  protect,
  validate([
    body("bookingId").isMongoId(),
    body("amount").optional().isFloat({ min: 0 }),
    body("gateway").optional().isIn(["RAZORPAY", "CASH", "WALLET"]),
  ]),
  paymentController.createPayment
);

/**
 * @swagger
 * /api/v1/payment/verify:
 *   post:
 *     summary: Verify a payment
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [paymentId]
 *             properties:
 *               paymentId:
 *                 type: string
 *               gatewayTransactionId:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [pending, completed, failed]
 *               razorpayOrderId:
 *                 type: string
 *               razorpayPaymentId:
 *                 type: string
 *               razorpaySignature:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment verified
 */
router.post(
  "/verify",
  protect,
  validate([
    body("paymentId").isMongoId(),
    body("gatewayTransactionId").optional().isString().trim(),
    body("status").optional().isIn(["pending", "completed", "failed"]),
    body("razorpayOrderId").optional().isString().trim(),
    body("razorpayPaymentId").optional().isString().trim(),
    body("razorpaySignature").optional().isString().trim(),
  ]),
  paymentController.verifyPayment
);

/**
 * @swagger
 * /api/v1/payment/webhook:
 *   post:
 *     summary: Razorpay Webhook
 *     tags: [Payment]
 *     responses:
 *       200:
 *         description: Webhook received
 */
router.post("/webhook", webhookLimiter, paymentController.razorpayWebhook);

module.exports = router;
