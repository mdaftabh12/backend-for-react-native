import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.model";
import { asyncHandler } from "../utils/async-handler";
import { ApiError } from "../utils/api-error";
import { ApiResponse } from "../utils/api-response";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import env from "../config/env";

// --------------------------------
// User Register
// --------------------------------
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "User with this email already exists", false, null);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const accessToken = generateAccessToken(user._id.toString());

  const refreshToken = generateRefreshToken(user._id.toString());

  user.refreshToken = await bcrypt.hash(refreshToken, 10);

  await user.save();

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const userResponse = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  return res
    .status(201)
    .json(new ApiResponse(true, "User registered successfully", userResponse));
});

// --------------------------------
// User Login
// --------------------------------
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(401, "Invalid email or password", false, null);
  }

  if (user.isDisabled) {
    throw new ApiError(403, "Your account has been disabled", false, null);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password", false, null);
  }

  const accessToken = generateAccessToken(user._id.toString());

  const refreshToken = generateRefreshToken(user._id.toString());

  user.refreshToken = await bcrypt.hash(refreshToken, 10);

  await user.save();

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const userResponse = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  return res
    .status(200)
    .json(new ApiResponse(true, "Login successful", userResponse));
});

// --------------------------------
// Refresh Access Token
// --------------------------------
const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    throw new ApiError(401, "Refresh token is required", false, null);
  }

  let decoded: { userId: string };

  try {
    decoded = jwt.verify(refreshToken, env.jwt.refreshTokenSecret) as {
      userId: string;
    };
  } catch {
    throw new ApiError(401, "Invalid or expired refresh token", false, null);
  }

  const user = await User.findById(decoded.userId).select("+refreshToken");

  if (!user || !user.refreshToken) {
    throw new ApiError(401, "Invalid refresh token", false, null);
  }

  if (user.isDisabled) {
    throw new ApiError(403, "Your account has been disabled", false, null);
  }

  const isValid = await bcrypt.compare(refreshToken, user.refreshToken);

  if (!isValid) {
    throw new ApiError(401, "Invalid refresh token", false, null);
  }

  const newAccessToken = generateAccessToken(user._id.toString());

  res.cookie("accessToken", newAccessToken, {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });

  return res
    .status(200)
    .json(new ApiResponse(true, "Access token refreshed successfully", null));
});

// --------------------------------
// Logout
// --------------------------------
const logoutUser = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, env.jwt.refreshTokenSecret) as {
        userId: string;
      };

      const user = await User.findById(decoded.userId).select("+refreshToken");

      if (user?.refreshToken) {
        const isValid = await bcrypt.compare(refreshToken, user.refreshToken);

        if (isValid) {
          user.refreshToken = null;
          await user.save();
        }
      }
    } catch {
      // Clear cookies even if token is invalid.
    }
  }

  const cookieOptions = {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: "strict" as const,
  };

  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);

  return res
    .status(200)
    .json(new ApiResponse(true, "User logged out successfully", null));
});

export { registerUser, loginUser, refreshAccessToken, logoutUser };
