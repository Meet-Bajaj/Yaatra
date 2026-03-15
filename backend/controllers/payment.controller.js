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

module.exports = {
  createPayment,
  verifyPayment,
};
