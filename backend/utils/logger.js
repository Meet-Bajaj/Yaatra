const fs = require("fs");
const path = require("path");

const winston = require("winston");
require("winston-daily-rotate-file");

const env = require("../config/env");

const logsDirectory = path.join(__dirname, "..", "logs");
if (!fs.existsSync(logsDirectory)) {
  fs.mkdirSync(logsDirectory, { recursive: true });
}

const transports = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }),
];

try {
  fs.accessSync(logsDirectory, fs.constants.W_OK);

  const fileTransport = new winston.transports.DailyRotateFile({
    dirname: logsDirectory,
    filename: "%DATE%-app.log",
    datePattern: "YYYY-MM-DD",
    maxFiles: "14d",
    zippedArchive: true,
  });

  // Prevent process crashes if file stream rotation fails at runtime.
  fileTransport.on("error", (error) => {
    // eslint-disable-next-line no-console
    console.error("Logger file transport error:", error.message);
  });

  transports.unshift(fileTransport);
} catch (error) {
  // eslint-disable-next-line no-console
  console.warn(`File logging disabled: ${error.message}`);
}

const logger = winston.createLogger({
  level: env.logs.level,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports,
});

module.exports = logger;
