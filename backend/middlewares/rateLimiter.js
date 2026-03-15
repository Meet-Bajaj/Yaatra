const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS || 60 * 1000, // Default 1 minute
  max: process.env.RATE_LIMIT_MAX || 120, // Limit each IP
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

module.exports = { apiLimiter };
