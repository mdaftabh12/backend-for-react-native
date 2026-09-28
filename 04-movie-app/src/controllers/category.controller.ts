import Category from "../models/category.model";
import { asyncHandler } from "../utils/async-handler";
import { ApiError } from "../utils/api-error";
import { ApiResponse } from "../utils/api-response";

// --------------------------------
// Create Category
// --------------------------------
const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const existingCategory = await Category.findOne({
    name,
  }).collation({ locale: "en", strength: 2 });

  if (existingCategory) {
    throw new ApiError(
      409,
      "This category already exists. Please choose another name.",
    );
  }

  let category = await Category.create({ name });

  return res
    .status(201)
    .json(new ApiResponse(true, "Category created successfully.", category));
});

// --------------------------------
// Get All Categories
// --------------------------------
const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({
    createdAt: -1,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(true, "Categories fetched successfully.", categories),
    );
});

// --------------------------------
// Get Category By ID
// --------------------------------
const getCategoryById = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const category = await Category.findById(categoryId);

  if (!category) {
    throw new ApiError(404, "Category not found. Please try again.");
  }

  return res
    .status(200)
    .json(new ApiResponse(true, "Category fetched successfully.", category));
});

// --------------------------------
// Update Category
// --------------------------------
const updateCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const { name } = req.body;

  console.log(name, categoryId);

  const category = await Category.findById(categoryId);

  if (!category) {
    throw new ApiError(404, "Category not found. Please try again.");
  }

  const existingCategory = await Category.findOne({
    name,
    _id: { $ne: categoryId },
  }).collation({ locale: "en", strength: 2 });

  if (existingCategory) {
    throw new ApiError(409, "Another category already uses this name.");
  }

  category.name = name;

  await category.save();

  return res
    .status(200)
    .json(new ApiResponse(true, "Category updated successfully.", category));
});

// --------------------------------
// Toggle Category Status
// --------------------------------
const toggleCategoryStatus = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const category = await Category.findByIdAndUpdate(
    categoryId,
    [
      {
        $set: {
          isActive: { $not: ["$isActive"] },
        },
      },
    ],
    { new: true },
  );

  if (!category) {
    throw new ApiError(404, "Category not found. Please try again.");
  }

  const message = category.isActive
    ? "Category activated successfully."
    : "Category deactivated successfully.";

  return res.status(200).json(
    new ApiResponse(true, message, {
      id: category._id,
      name: category.name,
      isActive: category.isActive,
    }),
  );
});

// --------------------------------
// Delete Category
// --------------------------------
const deleteCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const category = await Category.findByIdAndDelete(categoryId);

  if (!category) {
    throw new ApiError(404, "Category not found. Please try again.");
  }

  return res
    .status(200)
    .json(new ApiResponse(true, "Category deleted successfully.", null));
});

export {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  toggleCategoryStatus,
  deleteCategory,
};
