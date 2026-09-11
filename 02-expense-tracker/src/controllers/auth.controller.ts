import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/user.model";

// ====================
// Request Types
// ====================

export interface RegisterUserRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginUserRequest {
  email: string;
  password: string;
}

// ====================
// Register User
// ====================

const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body as RegisterUserRequest;

    // Validate required fields
    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter your name. 👤",
      });
    }

    if (!email?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter your email address. 📧",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Please enter a password. 🔐",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Your password must be at least 6 characters long. 🔐",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check existing user
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email already exists. Please log in instead. 👋",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "Your account was created successfully. 🎉",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({
        success: false,
        message: "We couldn't create your account. Please try again. 😕",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later. ⚠️",
    });
  }
};

// ====================
// Login User
// ====================

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as LoginUserRequest;

    if (!email?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter your email address. 📧",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Please enter your password. 🔐",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    // Don't reveal whether email exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Your email or password is incorrect. Please try again. 🔐",
      });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Your email or password is incorrect. Please try again. 🔐",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Welcome back! You’re logged in successfully. 👋",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      message: "We couldn't log you in. Please try again later. ⚠️",
    });
  }
};

// ====================
// Get Current User
// ====================

const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User information is missing. Please try again. ⚠️",
      });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "We couldn't find your account. Please log in again. 🔐",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Your profile was loaded successfully. 👤",
      data: user,
    });
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      message: "We couldn't load your profile. Please try again later. ⚠️",
    });
  }
};

// ====================
// Exports
// ====================

export { registerUser, loginUser, getCurrentUser };
