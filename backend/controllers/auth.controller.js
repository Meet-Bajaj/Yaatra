const register = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, message: "Auth register route" });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, message: "Auth login route" });
  } catch (error) {
    next(error);
  }
};

const verifyOTP = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, message: "Auth verify OTP route" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  verifyOTP,
};
