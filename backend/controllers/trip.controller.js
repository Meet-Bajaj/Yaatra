const createTrip = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, message: "Create trip route" });
  } catch (error) {
    next(error);
  }
};

const getTrips = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, message: "Get trips route" });
  } catch (error) {
    next(error);
  }
};

const getTripById = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, message: "Get trip by id route" });
  } catch (error) {
    next(error);
  }
};

const updateTripStatus = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, message: "Update trip status route" });
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
