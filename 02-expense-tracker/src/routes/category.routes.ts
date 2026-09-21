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
router.post("/create-category", createCategory);

// Get all categories
router.get("/get-all-categories", getAllCategories);

// Get single category
router.get("/get-category/:categoryId", getCategoryById);

// Update category
router.put("/update-category/:categoryId", updateCategory);

// Delete category
router.delete("/delete-category/:categoryId", deleteCategory);

export default router;
