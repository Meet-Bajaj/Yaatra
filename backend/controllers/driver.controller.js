const getDriverProfile = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, message: "Get driver profile route" });
  } catch (error) {
    next(error);
  }
};

const updateLocation = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, message: "Update driver location route" });
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, message: "Update driver status route" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDriverProfile,
  updateLocation,
  updateStatus,
};
