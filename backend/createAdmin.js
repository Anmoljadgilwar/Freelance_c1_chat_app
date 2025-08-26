const mongoose = require("mongoose");
const User = require("./models/User");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config({ path: "./config.env" });

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("Admin user already exists:", existingAdmin.email);
      process.exit(0);
    }

    // Create admin user
    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "admin123",
      role: "admin",
    });

    console.log("Admin user created successfully:");
    console.log("Email:", adminUser.email);
    console.log("Password: admin123");
    console.log("Role:", adminUser.role);

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
};

createAdmin();
