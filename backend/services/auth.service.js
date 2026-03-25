const twilio = require("twilio");

const env = require("../config/env");
const OTP = require("../models/otp");
const { getOTPExpiry, generateOTP } = require("../utils/otp");
const logger = require("../utils/logger");

let twilioClient = null;
if (
  env.twilio.accountSid &&
  env.twilio.authToken &&
  env.twilio.accountSid.startsWith("AC")
) {
  try {
    twilioClient = twilio(env.twilio.accountSid, env.twilio.authToken);
  } catch (error) {
    logger.warn("Twilio client could not be initialized; OTP delivery will fall back to mock mode.", {
      message: error.message,
    });
  }
}

const sendVerificationOTP = async (phone) => {
  if (env.twilio.verifyServiceSid && twilioClient) {
    await twilioClient.verify.v2
      .services(env.twilio.verifyServiceSid)
      .verifications.create({ to: phone, channel: "sms" });

    return {
      delivery: "twilio-verify",
      expiresInMinutes: 10,
    };
  }

  const otpCode = generateOTP();
  await OTP.deleteMany({ phone });
  await OTP.create({
    phone,
    code: otpCode,
    expiresAt: getOTPExpiry(10),
  });

  if (twilioClient && env.twilio.phoneNumber) {
    await twilioClient.messages.create({
      body: `Your RickRide verification code is ${otpCode}`,
      from: env.twilio.phoneNumber,
      to: phone,
    });
  } else {
    logger.info("Using development OTP delivery", {
      phone,
      otpCode,
    });
  }

  return {
    delivery: twilioClient && env.twilio.phoneNumber ? "twilio-sms" : "mock",
    expiresInMinutes: 10,
    mockCode: env.isProduction ? undefined : otpCode,
  };
};

const verifyOTP = async (phone, code) => {
  if (env.twilio.verifyServiceSid && twilioClient) {
    const verificationCheck = await twilioClient.verify.v2
      .services(env.twilio.verifyServiceSid)
      .verificationChecks.create({
        to: phone,
        code,
      });

    return verificationCheck.status === "approved";
  }

  const otpRecord = await OTP.findOne({
    phone,
    code,
    used: false,
    expiresAt: { $gt: new Date() },
  }).sort({ createdAt: -1 });

  if (!otpRecord) {
    return false;
  }

  otpRecord.used = true;
  await otpRecord.save();
  return true;
};

module.exports = {
  sendVerificationOTP,
  verifyOTP,
};
