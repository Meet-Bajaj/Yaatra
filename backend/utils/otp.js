// Basic mock OTP generator for testing/demo
const generateOTP = (length = 6) => {
  // In a real app we would use crypto or a random number generator
  // For demo consistency, we often use '123456' or a true random subset.
  const chars = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += chars[Math.floor(Math.random() * chars.length)];
  }
  return otp;
};

// Calculate when an OTP expires
const getOTPExpiry = (minutes = 10) => {
  return new Date(Date.now() + minutes * 60 * 1000);
};

module.exports = {
  generateOTP,
  getOTPExpiry,
};
