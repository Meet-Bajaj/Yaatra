const User = require("../models/users");
const asyncHandler = require("../middlewares/asyncHandler");
const { sendVerificationOTP, verifyOTP } = require("../services/auth.service");
const { sendSuccess } = require("../utils/apiResponse");
const AppError = require("../utils/appError");
const { generateToken } = require("../utils/jwt");
const { hashPassword } = require("../utils/password");

const normalizePhone = (value) => {
  const input = String(value || "").trim();
  if (!input) {
    return "";
  }

  const digitsOnly = input.replace(/\D/g, "");

  if (input.startsWith("+")) {
    return `+${digitsOnly}`;
  }

  if (digitsOnly.length === 10) {
    return `+91${digitsOnly}`;
  }

  if (digitsOnly.length > 10 && digitsOnly.startsWith("91")) {
    return `+${digitsOnly}`;
  }

  return input;
};

const getPhoneVariants = (value) => {
  const normalized = normalizePhone(value);
  const raw = String(value || "").trim();
  const digitsOnly = raw.replace(/\D/g, "");

  const variants = new Set([normalized, raw]);

  if (digitsOnly) {
    variants.add(digitsOnly);
    if (digitsOnly.length === 10) {
      variants.add(`+91${digitsOnly}`);
    }
    if (digitsOnly.startsWith("91") && digitsOnly.length >= 12) {
      variants.add(`+${digitsOnly}`);
      variants.add(digitsOnly.slice(2));
    }
  }

  return [...variants].filter(Boolean);
};

const register = asyncHandler(async (req, res) => {
  const { phone, name, email, password, role } = req.body;
  const normalizedPhone = normalizePhone(phone);

  if (!normalizedPhone) {
    throw new AppError("Phone number is required", 400);
  }

  const existingUser = await User.findOne({
    $or: [{ phone: { $in: getPhoneVariants(phone) } }, ...(email ? [{ email }] : [])],
  });
  if (existingUser) {
    throw new AppError("A user with this phone or email already exists", 409);
  }

  const user = await User.create({
    phone: normalizedPhone,
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
  const phoneVariants = getPhoneVariants(phone);

  if (!phoneVariants.length) {
    throw new AppError("Phone number is required", 400);
  }

  const user = await User.findOne({ phone: { $in: phoneVariants } });
  if (!user || !user.isActive || user.isDeleted) {
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

  const user = await User.findOne({ phone: { $in: phoneVariants } });
  if (!user || !user.isActive || user.isDeleted) {
    throw new AppError("User not found", 404);
  }

  const isValid = await verifyOTP(user.phone, code);
  if (!isValid) {
    throw new AppError("Invalid or expired OTP", 400);
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
