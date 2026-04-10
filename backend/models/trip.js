const mongoose = require("mongoose");

const pointSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  { _id: false }
);

const tripSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      required: true,
    },
    origin: {
      type: pointSchema,
      required: true,
    },
    destination: {
      type: pointSchema,
      required: true,
    },
    distance: {
      type: Number,
      required: true,
      min: 0,
    },
    departureTime: {
      type: Date,
      required: true,
    },
    totalSeats: {
      type: Number,
      required: true,
      min: 1,
    },
    availableSeats: {
      type: Number,
      required: true,
      min: 0,
    },
    pricePerSeat: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["open", "full", "ongoing", "completed", "cancelled"],
      default: "open",
    },
    notes: String,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

tripSchema.index({ origin: "2dsphere" });
tripSchema.index({ destination: "2dsphere" });
tripSchema.index({ status: 1, departureTime: 1 });

module.exports = mongoose.model("Trip", tripSchema);
