const crypto = require("crypto");
const Razorpay = require("razorpay");

const env = require("../config/env");
const logger = require("../utils/logger");

let razorpayInstance = null;
if (env.razorpay.keyId && env.razorpay.keySecret) {
  razorpayInstance = new Razorpay({
    key_id: env.razorpay.keyId,
    key_secret: env.razorpay.keySecret,
  });
}

const createRazorpayOrder = async (amountInINR, receiptId, notes = {}) => {
  if (!razorpayInstance) {
    logger.info("Using mock Razorpay order", { amountInINR, receiptId });
    return {
      id: `order_mock_${receiptId}`,
      amount: Math.round(amountInINR * 100),
      currency: "INR",
      receipt: receiptId,
      notes,
    };
  }

  return razorpayInstance.orders.create({
    amount: Math.round(amountInINR * 100),
    currency: "INR",
    receipt: String(receiptId),
    notes,
  });
};

const verifyRazorpaySignature = (orderId, paymentId, signature) => {
  if (!env.razorpay.keySecret) {
    return true;
  }

  const expectedSignature = crypto
    .createHmac("sha256", env.razorpay.keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return expectedSignature === signature;
};

const verifyRazorpayWebhookSignature = (payloadBuffer, signature) => {
  if (!env.razorpay.webhookSecret) {
    return true;
  }

  const digest = crypto
    .createHmac("sha256", env.razorpay.webhookSecret)
    .update(payloadBuffer)
    .digest("hex");

  return digest === signature;
};

module.exports = {
  createRazorpayOrder,
  verifyRazorpaySignature,
  verifyRazorpayWebhookSignature,
};
