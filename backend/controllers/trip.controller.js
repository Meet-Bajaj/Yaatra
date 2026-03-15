const Trip = require("../models/trip");

const createTrip = async (req, res, next) => {
  try {
    const { driverId, origin, destination, distance, dipartureTime, totalSeats, pricePerSeat, notes } = req.body;

    if (!driverId || !origin || !destination || !distance || !dipartureTime || !totalSeats || !pricePerSeat) {
      return res.status(400).json({ success: false, message: "Missing required trip fields" });
    }

    const trip = await Trip.create({
      driver: driverId,
      origin: { type: "Point", coordinates: origin }, // expect [lng, lat]
      destination: { type: "Point", coordinates: destination },
      distance,
      dipartureTime,
      totalSeats,
      pricePerSeat,
      notes,
    });

    res.status(201).json({ success: true, message: "Trip created successfully", data: trip });
  } catch (error) {
    next(error);
  }
};

const getTrips = async (req, res, next) => {
  try {
    // Optionally filter by status or location
    const { status } = req.query;
    const filter = status ? { status } : { status: "open" };

    const trips = await Trip.find(filter).populate("driver");
    res.status(200).json({ success: true, count: trips.length, data: trips });
  } catch (error) {
    next(error);
  }
};

const getTripById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const trip = await Trip.findById(id).populate("driver");
    
    if (!trip) {
      return res.status(404).json({ success: false, message: "Trip not found" });
    }

    res.status(200).json({ success: true, data: trip });
  } catch (error) {
    next(error);
  }
};

const updateTripStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["open", "full", "ongoing", "completed", "cancelled"].includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid trip status" });
    }

    const trip = await Trip.findByIdAndUpdate(id, { status }, { new: true });
    if (!trip) {
      return res.status(404).json({ success: false, message: "Trip not found" });
    }

    res.status(200).json({ success: true, message: "Trip status updated", data: trip });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTrip,
  getTrips,
  getTripById,
  updateTripStatus,
};
