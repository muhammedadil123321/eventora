const path = require("path");
const dotenv = require("dotenv");

// Load server/.env from server/src/utils/seedAdmin.js
const envPath = path.resolve(__dirname, "../../.env");
const envResult = dotenv.config({ path: envPath });

if (envResult.error) {
  console.error("Could not load .env file:", envPath);
  console.error(envResult.error.message);
  process.exit(1);
}

console.log("Loaded .env from:", envPath);

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const seedAdmin = async () => {
  try {
    const {
      MONGO_URI,
      ADMIN_NAME,
      ADMIN_EMAIL,
      ADMIN_PHONE,
      ADMIN_PASSWORD,
    } = process.env;

    // Check required environment variables
    if (
      !MONGO_URI ||
      !ADMIN_NAME ||
      !ADMIN_EMAIL ||
      !ADMIN_PHONE ||
      !ADMIN_PASSWORD
    ) {
      throw new Error(
        "Missing required environment variables. Check server/.env."
      );
    }

    console.log("MONGO_URI loaded:", Boolean(MONGO_URI));

    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB.");

    const email = ADMIN_EMAIL.trim().toLowerCase();

    // Prevent duplicate Admin creation
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.role === "admin") {
        console.log(`Admin already exists: ${email}`);
      } else {
        console.error(
          `This email already belongs to a ${existingUser.role} account.`
        );
      }

      return;
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

    // Create Admin account
    const admin = await User.create({
      fullName: ADMIN_NAME.trim(),
      email,
      phone: ADMIN_PHONE.trim(),
      password: hashedPassword,
      role: "admin",
      isActive: true,
    });

    console.log("Admin created successfully.");
    console.log("Admin ID:", admin._id.toString());
    console.log("Admin Email:", admin.email);
    console.log("Admin Role:", admin.role);
  } catch (error) {
    console.error("Admin seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
};

seedAdmin();