const Razorpay = require("razorpay");
const crypto = require("crypto");
const logger = require("../utils/logger");

let razorpayInstance;

if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

const createRazorpayOrder = async (amountInINR, receiptId) => {
  try {
    if (!razorpayInstance) {
      logger.warn("[Dev Mock Razorpay] Created mock order ID for standard mock gateway flow");
      return {
        id: "order_mock123ABC",
        amount: amountInINR * 100,
        currency: "INR",
        receipt: receiptId,
      };
    }

    const options = {
      amount: amountInINR * 100, // Amount in paise
      currency: "INR",
      receipt: receiptId.toString(),
      payment_capture: 1,
    };

    const order = await razorpayInstance.orders.create(options);
    return order;
  } catch (error) {
    logger.error("Razorpay Order Creation Error:", error);
    throw new Error("Failed to create Razorpay Order");
  }
};

const verifyRazorpaySignature = (orderId, paymentId, signature) => {
  if (!process.env.RAZORPAY_KEY_SECRET) return true; // mock allow

  const body = orderId + "|" + paymentId;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  return expectedSignature === signature;
};

module.exports = {
  createRazorpayOrder,
  verifyRazorpaySignature,
};
