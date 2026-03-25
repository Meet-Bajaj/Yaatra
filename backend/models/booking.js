const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    rider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      default: null,
    },
    autoDriver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      default: null,
    },
    seats: {
      type: Number,
      default: 1,
      min: 1,
    },
    fare: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ["RAZORPAY", "CASH", "WALLET"],
      required: true,
    },
    paymentReference: {
      type: String,
      sparse: true,
      unique: true,
    },
    driverAcceptedAt: Date,
    completedAt: Date,
    cancelledAt: Date,
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.index({ rider: 1, status: 1 });
bookingSchema.index({ trip: 1, status: 1 });
bookingSchema.index({ autoDriver: 1, status: 1 });

module.exports = mongoose.model("Booking", bookingSchema);
