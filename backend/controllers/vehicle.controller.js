const Vehicle = require("../models/vehicle");
const Driver = require("../models/driver");

const registerVehicle = async (req, res, next) => {
  try {
    const { driverId, type, reg_number, capicity, rcDocUrl, insuranceDocUrl, photoUrl, make, model, year } = req.body;

    if (!driverId || !type || !reg_number || !capicity) {
      return res.status(400).json({ success: false, message: "driverId, type, reg_number, and capicity are required" });
    }

    // Check uniqueness
    let existingVehicle = await Vehicle.findOne({ reg_number });
    if (existingVehicle) {
      return res.status(400).json({ success: false, message: "Vehicle with this registration number already exists" });
    }

    const vehicle = await Vehicle.create({
      driver: driverId,
      type,
      reg_number,
      capicity,
      rcDocUrl,
      insuranceDocUrl,
      photoUrl,
      make,
      model,
      year,
    });

    // Update the driver's vehicle reference
    await Driver.findByIdAndUpdate(driverId, { vehicle: vehicle._id });

    res.status(201).json({ success: true, message: "Vehicle registered successfully", data: vehicle });
  } catch (error) {
    next(error);
  }
};

const getVehicleDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const vehicle = await Vehicle.findById(id).populate("driver");
    if (!vehicle) {
      return res.status(404).json({ success: false, message: "Vehicle not found" });
    }

    res.status(200).json({ success: true, data: vehicle });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerVehicle,
  getVehicleDetails,
};
