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
 *     responses:
 *       200:
 *         description: Successfully hit verify payment route
 */
router.post("/verify", paymentController.verifyPayment);

module.exports = router;
