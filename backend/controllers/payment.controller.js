const Booking = require("../models/booking");
const Payment = require("../models/payment");
const asyncHandler = require("../middlewares/asyncHandler");
const { sendPushNotification } = require("../services/notification.service");
const {
  createRazorpayOrder,
  verifyRazorpaySignature,
  verifyRazorpayWebhookSignature,
} = require("../services/payment.service");
const { sendSuccess } = require("../utils/apiResponse");
const AppError = require("../utils/appError");
const env = require("../config/env");

const markBookingPaid = async (payment, paymentReference) => {
  const booking = await Booking.findByIdAndUpdate(
    payment.booking,
    {
      status: "confirmed",
      paymentReference,
    },
    { new: true }
  ).populate("rider", "fcmToken");

  if (booking && booking.rider && booking.rider.fcmToken) {
    await sendPushNotification(
      booking.rider.fcmToken,
      "Payment confirmed",
      "Your ride booking has been confirmed.",
      {
        bookingId: booking._id.toString(),
        paymentId: payment._id.toString(),
      }
    );
  }
};

const createPayment = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.body.bookingId);
  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  if (req.user.role !== "admin" && booking.rider.toString() !== req.user._id.toString()) {
    throw new AppError("You are not allowed to create payment for this booking", 403);
  }

  const gateway = req.body.gateway || booking.paymentMethod || "RAZORPAY";
  const amount = req.body.amount !== undefined ? Number(req.body.amount) : booking.fare;
  if (!Number.isFinite(amount) || amount < 0) {
    throw new AppError("Invalid payment amount", 400);
  }

  const existingCompletedPayment = await Payment.findOne({
    booking: booking._id,
    status: "completed",
  });
  if (existingCompletedPayment) {
    throw new AppError("This booking is already paid", 409);
  }

  const payment = await Payment.create({
    booking: booking._id,
    amount,
    gateway,
    status: "pending",
  });

  let gatewayPayload = null;

  if (gateway === "RAZORPAY") {
    gatewayPayload = await createRazorpayOrder(amount, payment._id.toString(), {
      bookingId: booking._id.toString(),
      paymentId: payment._id.toString(),
    });

    payment.gatewayOrderId = gatewayPayload.id;
    payment.rawResponse = gatewayPayload;
    await payment.save();
  }

  sendSuccess(res, {
    statusCode: 201,
    message: "Payment created successfully",
    data: {
      payment,
      gateway:
        gateway === "RAZORPAY"
          ? {
              provider: "razorpay",
              keyId: env.razorpay.keyId || "mock_key_id",
              order: gatewayPayload,
            }
          : null,
    },
  });
});

const verifyPayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.body.paymentId);
  if (!payment) {
    throw new AppError("Payment not found", 404);
  }

  if (payment.status === "completed") {
    sendSuccess(res, {
      message: "Payment already verified",
      data: payment,
    });
    return;
  }

  if (payment.gateway === "RAZORPAY") {
    const isValidSignature = verifyRazorpaySignature(
      req.body.razorpayOrderId,
      req.body.razorpayPaymentId,
      req.body.razorpaySignature
    );

    if (!isValidSignature) {
      payment.status = "failed";
      await payment.save();
      throw new AppError("Invalid Razorpay signature", 400);
    }

    payment.gatewayOrderId = req.body.razorpayOrderId;
    payment.gatewayTransactionId = req.body.razorpayPaymentId;
    payment.rawResponse = req.body;
    payment.status = "completed";
    await payment.save();

    await markBookingPaid(payment, req.body.razorpayPaymentId);
  } else {
    payment.gatewayTransactionId = req.body.gatewayTransactionId || payment.gatewayTransactionId;
    payment.rawResponse = req.body.rawResponse || req.body;
    payment.status = req.body.status || "completed";
    await payment.save();

    if (payment.status === "completed") {
      await markBookingPaid(payment, payment.gatewayTransactionId || payment._id.toString());
    }
  }

  sendSuccess(res, {
    message: "Payment verified successfully",
    data: payment,
  });
});

const razorpayWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers["x-razorpay-signature"];
  if (!verifyRazorpayWebhookSignature(req.body, signature)) {
    throw new AppError("Invalid Razorpay webhook signature", 400);
  }

  const payload = JSON.parse(req.body.toString("utf8"));
  if (payload.event === "payment.captured") {
    const orderId = payload.payload.payment.entity.order_id;
    const paymentId = payload.payload.payment.entity.id;

    const payment = await Payment.findOne({ gatewayOrderId: orderId });
    if (payment) {
      if (payment.status === "completed" && payment.gatewayTransactionId === paymentId) {
        sendSuccess(res, {
          message: "Webhook already processed",
        });
        return;
      }

      payment.gatewayTransactionId = paymentId;
      payment.rawResponse = payload;
      payment.status = "completed";
      await payment.save();
      await markBookingPaid(payment, paymentId);
    }
  }

  sendSuccess(res, {
    message: "Webhook received successfully",
  });
});

module.exports = {
  createPayment,
  razorpayWebhook,
  verifyPayment,
};
