const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const { connectDB } = require("../config/db");
const User = require("../models/users");

const seedAdmin = async () => {
  try {
    console.log("Connecting to database...");
    await connectDB();

    const adminPhone = "+911234567890"; // Replace with your desired admin phone number
    const adminEmail = "admin@rickride.com";

    const existingAdmin = await User.findOne({ phone: adminPhone });
    if (existingAdmin) {
      console.log("An admin with this phone number already exists.");
    } else {
      await User.create({
        name: "Super Admin",
        phone: adminPhone,
        email: adminEmail,
        role: "admin",
      });
      console.log(`Admin user created successfully! Phone: ${adminPhone}`);
    }
  } catch (error) {
    console.error("Failed to seed admin user:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed.");
    process.exit(0);
  }
};

seedAdmin();
