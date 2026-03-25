const User = require("../models/users");
const asyncHandler = require("../middlewares/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  sendSuccess(res, {
    data: user,
  });
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const allowedUpdates = ["name", "email", "avatarUrl", "fcmToken"];
  const updates = allowedUpdates.reduce((accumulator, key) => {
    if (req.body[key] !== undefined) {
      accumulator[key] = req.body[key];
    }

    return accumulator;
  }, {});

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  sendSuccess(res, {
    message: "User profile updated",
    data: user,
  });
});

module.exports = {
  getUserProfile,
  updateUserProfile,
};
