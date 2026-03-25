const fs = require("fs");
const path = require("path");

const winston = require("winston");
require("winston-daily-rotate-file");

const env = require("../config/env");

const logsDirectory = path.join(__dirname, "..", "logs");
if (!fs.existsSync(logsDirectory)) {
  fs.mkdirSync(logsDirectory, { recursive: true });
}

const transport = new winston.transports.DailyRotateFile({
  dirname: logsDirectory,
  filename: "%DATE%-app.log",
  datePattern: "YYYY-MM-DD",
  maxFiles: "14d",
  zippedArchive: true,
});

const logger = winston.createLogger({
  level: env.logs.level,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    transport,
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

module.exports = logger;
