import User from "../models/user.model";
import { asyncHandler } from "../utils/async-handler";
import { ApiError } from "../utils/api-error";
import { ApiResponse } from "../utils/api-response";

// --------------------------------
// Get Current User
// --------------------------------
const getCurrentUser = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new ApiError(401, "Please log in to continue");
  }

  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new ApiError(404, "Your account could not be found");
  }

  return res
    .status(200)
    .json(new ApiResponse(true, "Profile fetched successfully", user));
});

// --------------------------------
// Get All Users
// --------------------------------
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(true, "Users fetched successfully", users));
});

// --------------------------------
// Update User Profile
// --------------------------------
const updateUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new ApiError(401, "Please log in to update your profile");
  }

  const { name, email } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "Your account could not be found");
  }

  if (email && email !== user.email) {
    const existingUser = await User.findOne({
      email,
      _id: { $ne: userId },
    });

    if (existingUser) {
      throw new ApiError(409, "This email address is already registered");
    }
  }

  if (name !== undefined) {
    user.name = name;
  }

  if (email !== undefined) {
    user.email = email;
  }

  if (req.file) {
    user.avatar = `/uploads/avatars/${req.file.filename}`;
  }

  await user.save();

  const userResponse = {
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
    isDisabled: user.isDisabled,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return res
    .status(200)
    .json(new ApiResponse(true, "Profile updated successfully", userResponse));
});

// --------------------------------
// Disable / Enable User Account
// --------------------------------
const toggleUserStatus = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new ApiError(401, "Please log in to continue");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "Your account could not be found");
  }

  // Toggle account status
  user.isDisabled = !user.isDisabled;

  // Invalidate refresh token when disabling account
  if (user.isDisabled) {
    user.refreshToken = null;
  }

  await user.save();

  const message = user.isDisabled
    ? "Your account has been disabled successfully."
    : "Your account has been enabled successfully.";

  return res.status(200).json(
    new ApiResponse(true, message, {
      isDisabled: user.isDisabled,
    }),
  );
});

// --------------------------------
// Delete User Account
// --------------------------------
const userDelete = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new ApiError(401, "Please log in to continue");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "Your account could not be found");
  }

  await User.findByIdAndDelete(userId);

  return res
    .status(200)
    .json(
      new ApiResponse(true, "Your account has been deleted successfully", null),
    );
});

export {
  getCurrentUser,
  getAllUsers,
  updateUserProfile,
  toggleUserStatus,
  userDelete,
};
