const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");

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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookingId
 *               - amount
 *               - gateway
 *             properties:
 *               bookingId:
 *                 type: string
 *               amount:
 *                 type: number
 *                 example: 25.50
 *               gateway:
 *                 type: string
 *                 enum: [STRIP, PAYPAL, RAZORPAY]
 *                 example: "RAZORPAY"
 *     responses:
 *       200:
 *         description: Successfully hit create payment route
 */
router.post("/create", paymentController.createPayment);

/**
 * @swagger
 * /api/v1/payment/verify:
 *   post:
 *     summary: Verify a payment
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paymentId
 *               - status
 *             properties:
 *               paymentId:
 *                 type: string
 *               gatewayTransactionId:
 *                 type: string
 *                 example: "pay_XYZ123"
 *               status:
 *                 type: string
 *                 enum: [pending, completed, failed]
 *                 example: "completed"
 *               rawResponse:
 *                 type: object
 *     responses:
 *       200:
 *         description: Successfully hit verify payment route
 */
router.post("/verify", paymentController.verifyPayment);

/**
 * @swagger
 * /api/v1/payment/webhook:
 *   post:
 *     summary: Razorpay Webhook processor
 *     tags: [Payment]
 *     description: Used strictly for Razorpay server-to-server callbacks
 *     responses:
 *       200:
 *         description: Webhook received successfully
 */
// Webhooks require the raw buffer for signature hash matching
router.post(
  "/webhook", 
  express.raw({ type: "application/json" }), 
  paymentController.razorpayWebhook
);

module.exports = router;
