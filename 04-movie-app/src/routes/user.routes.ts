import { Router } from "express";

import {
  getCurrentUser,
  getAllUsers,
  updateUserProfile,
  toggleUserStatus,
  userDelete,
} from "../controllers/user.controller";

import { authMiddleware, authorizeRoles } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { upload } from "../middleware/multer.middleware";
import { updateUserSchema } from "../validations/user.validation";

const router = Router();

// --------------------------------
// Current User
// --------------------------------
router.get("/profile", authMiddleware, getCurrentUser);

// --------------------------------
// Update Profile
// --------------------------------
router.put(
  "/update-profile",
  authMiddleware,
  upload.single("avatar"),
  validate(updateUserSchema),
  updateUserProfile,
);

// --------------------------------
// Disable / Enable Own Account
// --------------------------------
router.put("/toggle-status", authMiddleware, toggleUserStatus);

// --------------------------------
// Delete Own Account
// --------------------------------
router.delete("/delete-user", authMiddleware, userDelete);

// --------------------------------
// Admin - Get All Users
// --------------------------------
router.get("/get-users", authMiddleware, authorizeRoles("ADMIN"), getAllUsers);

export { router as userRouter };
