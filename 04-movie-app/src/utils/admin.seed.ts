import bcrypt from "bcryptjs";
import User from "../models/user.model";
import env from "../config/env";

const seedAdmin = async (): Promise<void> => {
  try {
    const adminEmail = env.admin.adminEmail;
    const adminPassword = env.admin.adminPassword;

    const existingAdmin = await User.findOne({
      email: adminEmail,
      role: "ADMIN",
    });

    if (existingAdmin) {
      console.log("✅ Admin already exists");
      return;
    }


    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await User.create({
      name: "Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "ADMIN",
      isDisabled: false,
    });

    console.log("✅ Admin created successfully");
  } catch (error) {
    console.error("❌ Admin seed failed:", error);
  }
};

export default seedAdmin;
