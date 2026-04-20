const User = require("../models/users");
const asyncHandler = require("../middlewares/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const AppError = require("../utils/appError");
const logger = require("../utils/logger");

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findOne({
    _id: req.user._id,
    isActive: true,
    isDeleted: false,
  });

  if (!user) {
    throw new AppError("User profile not found", 404);
  }

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

  const user = await User.findOneAndUpdate(
    {
      _id: req.user._id,
      isActive: true,
      isDeleted: false,
    },
    updates,
    {
    new: true,
    runValidators: true,
    }
  );

  if (!user) {
    throw new AppError("User profile not found", 404);
  }

  logger.info("User profile updated", {
    userId: user._id,
    updatedFields: Object.keys(updates),
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
