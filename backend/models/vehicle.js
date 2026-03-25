const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ["CAR", "RICKSHAW"],
      required: true,
    },
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      alias: "reg_number",
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
      alias: "capicity",
    },
    rcDocUrl: String,
    insuranceDocUrl: String,
    photoUrl: String,
    make: String,
    model: String,
    year: Number,
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

module.exports = mongoose.model("Vehicle", vehicleSchema);
