const multer = require("multer");

const env = require("../config/env");
const AppError = require("../utils/appError");
const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || res.statusCode || 500;
  let message = err.message || "Internal server error";
  let details = err.details;

  if (statusCode < 400) {
    statusCode = 500;
  }

  if (err.name === "CastError") {
    statusCode = 404;
    message = "Resource not found";
  }

  if (err.code === 11000) {
    statusCode = 409;
    message = "A record with the same unique field already exists";
    details = err.keyValue;
  }

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed";
    details = Object.values(err.errors).map((value) => value.message);
  }

  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid authentication token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Authentication token has expired";
  }

  if (err instanceof multer.MulterError) {
    statusCode = 400;
    message = err.message;
  }

  logger.error("Request failed", {
    method: req.method,
    path: req.originalUrl,
    statusCode,
    message,
    stack: err.stack,
    details,
  });

  return res.status(statusCode).json({
    success: false,
    message,
    ...(details ? { details } : {}),
    ...(env.isProduction ? {} : { stack: err.stack }),
  });
};

const notFound = (req, res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
};

module.exports = {
  errorHandler,
  notFound,
};
