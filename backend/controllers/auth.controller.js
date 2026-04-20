const User = require("../models/users");
const asyncHandler = require("../middlewares/asyncHandler");
const { sendVerificationOTP, verifyOTP } = require("../services/auth.service");
const { sendSuccess } = require("../utils/apiResponse");
const AppError = require("../utils/appError");
const { generateToken } = require("../utils/jwt");
const { hashPassword } = require("../utils/password");
const logger = require("../utils/logger");

const normalizePhone = (value) => {
  const input = String(value || "").trim();
  if (!input) {
    return "";
  }

  const digitsOnly = input.replace(/\D/g, "");
  if (!digitsOnly) {
    return "";
  }

  // Normalize all accepted India-style inputs to +91XXXXXXXXXX.
  const localTenDigits = digitsOnly.slice(-10);
  return `+91${localTenDigits}`;
};

const getPhoneVariants = (value) => {
  const normalized = normalizePhone(value);
  const raw = String(value || "").trim();
  const digitsOnly = raw.replace(/\D/g, "");

  const variants = new Set([normalized, raw]);

  if (digitsOnly) {
    variants.add(digitsOnly);

    const localTenDigits = digitsOnly.slice(-10);
    variants.add(localTenDigits);
    variants.add(`+91${localTenDigits}`);
    variants.add(`91${localTenDigits}`);
    variants.add(`0${localTenDigits}`);
  }

  return [...variants].filter(Boolean);
};

const register = asyncHandler(async (req, res) => {
  const { phone, name, email, password, role } = req.body;
  const normalizedPhone = normalizePhone(phone);
  const phoneVariants = getPhoneVariants(phone);
  const normalizedEmail = email ? String(email).trim().toLowerCase() : undefined;

  if (!normalizedPhone) {
    throw new AppError("Phone number is required", 400);
  }

  const existingUser = await User.findOne({
    $or: [{ phone: { $in: phoneVariants } }, ...(normalizedEmail ? [{ email: normalizedEmail }] : [])],
  }).select("_id phone email role isDeleted");

  if (existingUser) {
    logger.warn("Registration blocked due to existing user identity", {
      phone: normalizedPhone,
      role: existingUser.role,
      existingUserId: existingUser._id,
      existingUserDeleted: existingUser.isDeleted,
    });
    throw new AppError("A user with this phone or email already exists", 409);
  }

  const user = await User.create({
    phone: normalizedPhone,
    name,
    email: normalizedEmail,
    password: password ? hashPassword(password) : undefined,
    role: role || "rider",
  });

  logger.info("User registered", {
    userId: user._id,
    role: user.role,
    phone: user.phone,
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
  const phoneVariants = getPhoneVariants(phone);

  if (!phoneVariants.length) {
    throw new AppError("Phone number is required", 400);
  }

  const user = await User.findOne({
    phone: { $in: phoneVariants },
    isActive: true,
    isDeleted: false,
  }).select("_id phone role isActive isDeleted");

  if (!user) {
    logger.warn("Login denied: active user not found", {
      phoneVariants,
    });
    throw new AppError("User not found", 404);
  }

  const otpDetails = await sendVerificationOTP(user.phone);

  sendSuccess(res, {
    message: "OTP sent successfully",
    data: {
      phone: user.phone,
      delivery: otpDetails.delivery,
      ...(otpDetails.mockCode ? { mockCode: otpDetails.mockCode } : {}),
    },
  });
});

const verifyUserOTP = asyncHandler(async (req, res) => {
  const { phone, code } = req.body;
  const phoneVariants = getPhoneVariants(phone);

  if (!phoneVariants.length) {
    throw new AppError("Phone number is required", 400);
  }

  const user = await User.findOne({
    phone: { $in: phoneVariants },
    isActive: true,
    isDeleted: false,
  });

  if (!user) {
    logger.warn("OTP verification denied: active user not found", {
      phoneVariants,
    });
    throw new AppError("User not found", 404);
  }

  const isValid = await verifyOTP(user.phone, code);
  if (!isValid) {
    throw new AppError("Invalid or expired OTP", 400);
  }

  const token = generateToken(user._id, user.role);

  logger.info("User authenticated via OTP", {
    userId: user._id,
    role: user.role,
  });

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
