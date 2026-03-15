const { generateOTP, getOTPExpiry } = require("../utils/otp");
const OTP = require("../models/otp");
const twilio = require("twilio");

// Initialize Twilio client lazily or securely based on environment variables
let twilioClient;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

const sendVerificationOTP = async (phone) => {
  try {
    const otpCode = generateOTP();
    const expiresAt = getOTPExpiry(10); // 10 minutes

    // Store securely in DB
    await OTP.create({
      phone,
      code: otpCode,
      expiresAt,
    });

    if (twilioClient) {
      // Logic for Twilio delivery
      // await twilioClient.messages.create({
      //   body: `Your RikRide verification code is ${otpCode}`,
      //   from: process.env.TWILIO_PHONE_NUMBER,
      //   to: phone,
      // });
      console.log(`[Twilio Mock] Sent OTP ${otpCode} to ${phone}`);
    } else {
      console.log(`[Dev Mock] OTP generated for ${phone}: ${otpCode}`);
    }

    return { success: true, message: "OTP sent successfully", mockCode: otpCode };
  } catch (error) {
    console.error("Auth Service Error:", error);
    throw new Error("Failed to send verification OTP");
  }
};

module.exports = {
  sendVerificationOTP,
};
