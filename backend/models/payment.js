const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    gateway: {
      type: String,
      enum: ["RAZORPAY", "CASH", "WALLET"],
      required: true,
    },
    gatewayTransactionId: {
      type: String,
      sparse: true,
      unique: true,
    },
    gatewayOrderId: {
      type: String,
      sparse: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    rawResponse: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

paymentSchema.index({ booking: 1 });

module.exports = mongoose.model("Payment", paymentSchema);
