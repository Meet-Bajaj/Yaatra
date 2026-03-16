const Payment = require("../models/payment");
const Booking = require("../models/booking");

const createPayment = async (req, res, next) => {
  try {
    const { bookingId, amount, gateway } = req.body;

    if (!bookingId || amount === undefined || !gateway) {
      return res.status(400).json({ success: false, message: "bookingId, amount, and gateway are required" });
    }

    if (!["STRIP", "PAYPAL", "RAZORPAY"].includes(gateway)) {
        return res.status(400).json({ success: false, message: "Invalid gateway" });
    }

    // Usually you would integrate Stripe/Razorpay SDK here to get a payment intent order ID

    const payment = await Payment.create({
      booking: bookingId,
      amount,
      gateway,
      status: "pending",
    });

    res.status(201).json({ success: true, message: "Payment intent created", data: payment });
  } catch (error) {
    next(error);
  }
};

const verifyPayment = async (req, res, next) => {
  try {
    const { paymentId, gatewayTransactionId, status, rawResponse } = req.body;

    if (!paymentId || !status) {
      return res.status(400).json({ success: false, message: "paymentId and status are required" });
    }

    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      {
        gatewayTransactionId,
        status,
        rawResponse,
      },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }

    if (status === "completed") {
       await Booking.findByIdAndUpdate(payment.booking, { status: "confirmed" });
    }

    res.status(200).json({ success: true, message: "Payment verified", data: payment });
  } catch (error) {
    next(error);
  }
};

const crypto = require("crypto");

const razorpayWebhook = async (req, res, next) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || "default_mock_secret";
    
    // Express raw() provides req.body as a Buffer
    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(req.body);
    const digest = shasum.digest("hex");

    const razorpaySignature = req.headers["x-razorpay-signature"];

    if (digest !== razorpaySignature && process.env.NODE_ENV === "production") {
       return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    // In a real app we parse the buffer back to JSON to execute logic
    const payload = JSON.parse(req.body.toString());
    
    // Example: Act upon payload.event == 'payment.captured'
    // Update Booking similarly to verifyPayment
    
    res.status(200).json({ success: true, message: "Webhook received" });
  } catch (error) {
    console.error("Webhook Error:", error);
    res.status(500).json({ success: false, message: "Webhook Processing Error" });
  }
};

module.exports = {
  createPayment,
  verifyPayment,
  razorpayWebhook,
};
