const User = require("../models/users");
const asyncHandler = require("../middlewares/asyncHandler");
const { sendVerificationOTP, verifyOTP } = require("../services/auth.service");
const { sendSuccess } = require("../utils/apiResponse");
const AppError = require("../utils/appError");
const { generateToken } = require("../utils/jwt");
const { hashPassword } = require("../utils/password");

const register = asyncHandler(async (req, res) => {
  const { phone, name, email, password, role } = req.body;

  const existingUser = await User.findOne({
    $or: [{ phone }, ...(email ? [{ email }] : [])],
  });
  if (existingUser) {
    throw new AppError("A user with this phone or email already exists", 409);
  }

  const user = await User.create({
    phone,
    name,
    email,
    password: password ? hashPassword(password) : undefined,
    role: role || "rider",
  });

  const token = generateToken(user._id, user.role);

  sendSuccess(res, {
    statusCode: 201,
    message: "User registered successfully",
    data: {
      user,
      token,
    },
  });
});

const login = asyncHandler(async (req, res) => {
  const { phone } = req.body;

  const user = await User.findOne({ phone });
  if (!user || !user.isActive || user.isDeleted) {
    throw new AppError("User not found", 404);
  }

  const otpDetails = await sendVerificationOTP(phone);

  sendSuccess(res, {
    message: "OTP sent successfully",
    data: {
      phone,
      delivery: otpDetails.delivery,
      ...(otpDetails.mockCode ? { mockCode: otpDetails.mockCode } : {}),
    },
  });
});

const verifyUserOTP = asyncHandler(async (req, res) => {
  const { phone, code } = req.body;

  const isValid = await verifyOTP(phone, code);
  if (!isValid) {
    throw new AppError("Invalid or expired OTP", 400);
  }

  const user = await User.findOne({ phone });
  if (!user || !user.isActive || user.isDeleted) {
    throw new AppError("User not found", 404);
  }

  const token = generateToken(user._id, user.role);

  sendSuccess(res, {
    message: "OTP verified successfully",
    data: {
      user,
      token,
    },
  });
});

module.exports = {
  login,
  register,
  verifyOTP: verifyUserOTP,
};
