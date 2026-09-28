import { Router } from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  toggleCategoryStatus,
  deleteCategory,
} from "../controllers/category.controller";
import { authMiddleware, authorizeRoles } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  categoryIdSchema,
  createCategorySchema,
  updateCategorySchema,
} from "../validations/category.validation";

const router = Router();

// --------------------------------
// Public - Get All Categories
// --------------------------------
router.get("/get-categories", getAllCategories);

// --------------------------------
// Public - Get Category By ID
// --------------------------------
router.get(
  "/get-category/:categoryId",
  validate(categoryIdSchema),
  getCategoryById,
);

// --------------------------------
// Admin - Create Category
// --------------------------------
router.post(
  "/create-category",
  authMiddleware,
  authorizeRoles("ADMIN"),
  validate(createCategorySchema),
  createCategory,
);

// --------------------------------
// Admin - Update Category
// --------------------------------
router.put(
  "/update-category/:categoryId",
  authMiddleware,
  authorizeRoles("ADMIN"),
  validate(updateCategorySchema),
  updateCategory,
);

// --------------------------------
// Admin - Toggle Category Status
// --------------------------------
router.put(
  "/toggle-status/:categoryId",
  authMiddleware,
  authorizeRoles("ADMIN"),
  validate(categoryIdSchema),
  toggleCategoryStatus,
);

// --------------------------------
// Admin - Delete Category
// --------------------------------
router.delete(
  "/delete-category/:categoryId",
  authMiddleware,
  authorizeRoles("ADMIN"),
  validate(categoryIdSchema),
  deleteCategory,
);

export { router as categoryRouter };
