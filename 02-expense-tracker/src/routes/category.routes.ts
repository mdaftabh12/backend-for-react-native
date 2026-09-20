import { Router } from "express";

import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller";

const router = Router();

// Create category
router.post("/", createCategory);

// Get all categories
router.get("/", getAllCategories);

// Get single category
router.get("/:categoryId", getCategoryById);

// Update category
router.put("/:categoryId", updateCategory);

// Delete category
router.delete("/:categoryId", deleteCategory);

export default router;