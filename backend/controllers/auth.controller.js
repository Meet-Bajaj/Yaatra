const User = require("../models/users");
const OTP = require("../models/otp");
const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "YOUR_SUPER_SECRET_KEY", {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

const register = async (req, res, next) => {
  try {
    const { phone, name, email, password, role } = req.body;

    if (!phone) {
      return res.status(400).json({ success: false, message: "Phone number is required" });
    }

    let user = await User.findOne({ phone });
    if (user) {
      return res.status(400).json({ success: false, message: "User with this phone number already exists" });
    }

    user = await User.create({
      phone,
      name,
      email,
      password,
      role: role || "rider",
    });

    // Automatically generate a token upon successful registration for automatic login
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ success: false, message: "Phone number is required" });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Generate a mock OTP (e.g., 123456)
    const otpCode = "123456"; 
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    await OTP.create({
      phone,
      code: otpCode,
      expiresAt,
    });

    res.status(200).json({
      success: true,
      message: "OTP sent successfully (Mock: 123456)",
    });
  } catch (error) {
    next(error);
  }
};

const verifyOTP = async (req, res, next) => {
  try {
    const { phone, code } = req.body;

    if (!phone || !code) {
      return res.status(400).json({ success: false, message: "Phone and code are required" });
    }

    const otpRecord = await OTP.findOne({ phone, code, used: false, expiresAt: { $gt: new Date() } });

    if (!otpRecord) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    // Mark OTP as used
    otpRecord.used = true;
    await otpRecord.save();

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found loging in" });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  verifyOTP,
};
