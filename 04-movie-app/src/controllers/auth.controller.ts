import bcrypt from "bcryptjs";
import User from "../models/user.model";
import { asyncHandler } from "../utils/async-handler";
import { ApiError } from "../utils/api-error";
import { ApiResponse } from "../utils/api-response";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";

// user register
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const accessToken = generateAccessToken(user._id.toString());

  const refreshToken = generateRefreshToken(user._id.toString());

  const userResponse = {
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
  };

  res.status(201).json(
    new ApiResponse(
      201,
      {
        user: userResponse,
        accessToken,
        refreshToken,
      },
      "User registered successfully",
    ),
  );
});

// user login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const accessToken = generateAccessToken(user._id.toString());
  const refreshToken = generateRefreshToken(user._id.toString());

  const userResponse = {
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
  };

  res.status(200).json(
    new ApiResponse(
      200,
      {
        user: userResponse,
        accessToken,
        refreshToken,
      },
      "Login successful",
    ),
  );
});

// Logout
const logout = asyncHandler(async (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false, // production me true
    sameSite: "strict",
  });

  res
    .status(200)
    .json(new ApiResponse(200, null, "User logged out successfully"));
});

export { register, login,logout };
