const mongoose = require("mongoose");

const connectDB = mongoose
  .connect(process.env.MONGO_DB_URL || "mongodb://localhost:27017/rickride")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });

module.exports = { connectDB };
