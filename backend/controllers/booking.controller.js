const createBooking = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, message: "Create booking route" });
  } catch (error) {
    next(error);
  }
};

const getBooking = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, message: "Get booking route" });
  } catch (error) {
    next(error);
  }
};

const cancelBooking = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, message: "Cancel booking route" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getBooking,
  cancelBooking,
};
