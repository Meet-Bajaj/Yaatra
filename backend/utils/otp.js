const crypto = require("crypto");

const generateOTP = (length = 6) => {
  let otp = "";

  for (let index = 0; index < length; index += 1) {
    otp += crypto.randomInt(0, 10).toString();
  }

  return otp;
};

const getOTPExpiry = (minutes = 10) => new Date(Date.now() + minutes * 60 * 1000);

module.exports = {
  generateOTP,
  getOTPExpiry,
};
