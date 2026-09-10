const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const mongoose = require("mongoose");
const connectDB = require("./config/db");
const User = require("./models/User");

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || "admin@tekora.com";
const ADMIN_NAME = process.env.SEED_ADMIN_NAME || "Tekora Admin";
const ADMIN_PHONE = process.env.SEED_ADMIN_PHONE || "9800000000";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "admin123";

const seedAdmin = async () => {
  try {
    await connectDB();

    const existing = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });
    if (existing) {
      console.log(`Admin already exists (${ADMIN_EMAIL}). Updating to admin role...`);
      if (existing.role !== "admin") {
        existing.role = "admin";
      }
      existing.isEmailVerified = true;
      await existing.save();
      console.log("Admin role ensured.");
    } else {
      await User.create({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL.toLowerCase(),
        phone: ADMIN_PHONE,
        password: ADMIN_PASSWORD,
        role: "admin",
        isEmailVerified: true,
      });
      console.log(`Admin created: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
    }
  } catch (err) {
    console.error("Seed failed:", err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seedAdmin();
