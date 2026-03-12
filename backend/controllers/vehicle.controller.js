const registerVehicle = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, message: "Register vehicle route" });
  } catch (error) {
    next(error);
  }
};

const getVehicleDetails = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, message: "Get vehicle details route" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerVehicle,
  getVehicleDetails,
};
