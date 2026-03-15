const Booking = require("../models/booking");

const createBooking = async (req, res, next) => {
  try {
    const { riderId, tripId, autoDriverId, seats, fare, paymentMethod } = req.body;

    if (!riderId || !fare || !paymentMethod) {
      return res.status(400).json({ success: false, message: "riderId, fare, and paymentMethod are required" });
    }

    if (!tripId && !autoDriverId) {
      return res.status(400).json({ success: false, message: "Must provide either tripId or autoDriverId" });
    }

    const booking = await Booking.create({
      rider: riderId,
      trip: tripId,
      autoDriver: autoDriverId,
      seats: seats || 1,
      fare,
      paymentMethod,
    });

    res.status(201).json({ success: true, message: "Booking created successfully", data: booking });
  } catch (error) {
    next(error);
  }
};

const getBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id).populate("rider").populate("trip").populate("autoDriver");
    
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

const cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByIdAndUpdate(id, { status: "cancelled", cancelledAt: Date.now() }, { new: true });
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    res.status(200).json({ success: true, message: "Booking cancelled", data: booking });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getBooking,
  cancelBooking,
};
