import { Request, Response } from "express";
import mongoose from "mongoose";
import Category from "../models/category.model";

// ====================
// Request Types
// ====================

interface CreateCategoryRequest {
  userId: string;
  name: string;
  icon?: string;
  color?: string;
}

interface UpdateCategoryRequest {
  name?: string;
  icon?: string;
  color?: string;
}

// ====================
// Create Category
// ====================

const createCategory = async (req: Request, res: Response) => {
  try {
    const { userId, name, icon, color } =
      req.body as CreateCategoryRequest;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User information is required. ⚠️",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID. ⚠️",
      });
    }

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter a category name. 📁",
      });
    }

    const existingCategory = await Category.findOne({
      userId,
      name: name.trim(),
    });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "This category already exists. 📁",
      });
    }

    const category = await Category.create({
      userId,
      name: name.trim(),
      icon: icon?.trim() || "📁",
      color: color?.trim() || "#3B82F6",
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully. 🎉",
      data: category,
    });
  } catch (error: unknown) {
    console.error("Create category error:", error);

    return res.status(500).json({
      success: false,
      message: "We couldn't create the category. Please try again. ⚠️",
    });
  }
};

// ====================
// Get All Categories
// ====================

const getAllCategories = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({
        success: false,
        message: "User information is required. ⚠️",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID. ⚠️",
      });
    }

    const categories = await Category.find({ userId }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      message: "Categories loaded successfully. 📁",
      count: categories.length,
      data: categories,
    });
  } catch (error: unknown) {
    console.error("Get categories error:", error);

    return res.status(500).json({
      success: false,
      message: "We couldn't load the categories. Please try again. ⚠️",
    });
  }
};

// ====================
// Get Category By ID
// ====================

const getCategoryById = async (req: Request, res: Response) => {
  try {
    const categoryId  = req.params.categoryId as string;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID. ⚠️",
      });
    }

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found. 📁",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category loaded successfully. 📁",
      data: category,
    });
  } catch (error: unknown) {
    console.error("Get category error:", error);

    return res.status(500).json({
      success: false,
      message: "We couldn't load the category. Please try again. ⚠️",
    });
  }
};

// ====================
// Update Category
// ====================

const updateCategory = async (req: Request, res: Response) => {
  try {
    const categoryId = req.params.categoryId as string;

    const { name, icon, color } =
      req.body as UpdateCategoryRequest;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID. ⚠️",
      });
    }

    if (
      name === undefined &&
      icon === undefined &&
      color === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide something to update. ⚠️",
      });
    }

    if (name !== undefined && !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name cannot be empty. 📁",
      });
    }

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found. 📁",
      });
    }

    if (name !== undefined) {
      const existingCategory = await Category.findOne({
        userId: category.userId,
        name: name.trim(),
        _id: { $ne: categoryId },
      });

      if (existingCategory) {
        return res.status(409).json({
          success: false,
          message: "This category already exists. 📁",
        });
      }

      category.name = name.trim();
    }

    if (icon !== undefined) {
      category.icon = icon.trim();
    }

    if (color !== undefined) {
      category.color = color.trim();
    }

    await category.save();

    return res.status(200).json({
      success: true,
      message: "Category updated successfully. ✨",
      data: category,
    });
  } catch (error: unknown) {
    console.error("Update category error:", error);

    return res.status(500).json({
      success: false,
      message: "We couldn't update the category. Please try again. ⚠️",
    });
  }
};

// ====================
// Delete Category
// ====================

const deleteCategory = async (req: Request, res: Response) => {
  try {
    const categoryId  = req.params.categoryId as string;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID. ⚠️",
      });
    }

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found. 📁",
      });
    }

    await Category.findByIdAndDelete(categoryId);

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully. 🗑️",
    });
  } catch (error: unknown) {
    console.error("Delete category error:", error);

    return res.status(500).json({
      success: false,
      message: "We couldn't delete the category. Please try again. ⚠️",
    });
  }
};

// ====================
// Exports
// ====================

export {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
