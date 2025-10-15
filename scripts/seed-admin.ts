import dotenv from "dotenv";
import { resolve } from "path";

// Load environment variables from .env.local BEFORE any other imports
dotenv.config({ path: resolve(process.cwd(), ".env.local") });

async function seedAdmin() {
  try {
    // Dynamic imports to ensure dotenv loads first
    const { default: connectDB } = await import("../lib/db.js");
    const { default: User } = await import("../models/User.js");

    await connectDB();

    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log("✅ Admin user already exists");
      process.exit(0);
    }

    // Create admin user
    await User.create({
      email: adminEmail,
      password: adminPassword,
      name: "Admin",
      role: "admin",
    });

    console.log("✅ Admin user created successfully");
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
    process.exit(1);
  }
}

seedAdmin();
