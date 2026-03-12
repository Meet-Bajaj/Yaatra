const getUserProfile = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, message: "Get user profile route" });
  } catch (error) {
    next(error);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, message: "Update user profile route" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
};
