const createPayment = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, message: "Create payment route" });
  } catch (error) {
    next(error);
  }
};

const verifyPayment = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, message: "Verify payment route" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPayment,
  verifyPayment,
};
