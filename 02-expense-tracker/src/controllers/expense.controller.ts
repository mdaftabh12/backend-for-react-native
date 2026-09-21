import { Request, Response } from "express";
import mongoose from "mongoose";

import Expense from "../models/expense.model";
import Category from "../models/category.model";

// ====================
// Request Types
// ====================

interface CreateExpenseRequest {
  userId: string;
  categoryId: string;
  amount: number;
  expenseDate: string;
  note?: string;
}

interface UpdateExpenseRequest {
  categoryId?: string;
  amount?: number;
  expenseDate?: string;
  note?: string;
}

// ====================
// Create Expense
// ====================

const createExpense = async (req: Request, res: Response) => {
  try {
    const { userId, categoryId, amount, expenseDate, note } =
      req.body as CreateExpenseRequest;

    // Validate user
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

    // Validate category
    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Please select a category. 📁",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID. ⚠️",
      });
    }

    // Validate amount
    if (amount === undefined || amount === null || typeof amount !== "number") {
      return res.status(400).json({
        success: false,
        message: "Please enter an expense amount. 💰",
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Expense amount must be greater than ₹0. 💰",
      });
    }

    // Validate date
    if (!expenseDate) {
      return res.status(400).json({
        success: false,
        message: "Please select an expense date. 📅",
      });
    }

    const parsedDate = new Date(expenseDate);

    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid expense date. 📅",
      });
    }

    // Check category belongs to user
    const category = await Category.findOne({
      _id: categoryId,
      userId,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found for this user. 📁",
      });
    }

    // Create expense
    const expense = await Expense.create({
      userId,
      categoryId,
      amount,
      expenseDate: parsedDate,
      note: note?.trim() || undefined,
    });

    // Return category information too
    const populatedExpense = await Expense.findById(expense._id).populate(
      "categoryId",
      "name icon color",
    );

    return res.status(201).json({
      success: true,
      message: "Expense added successfully. 🎉",
      data: populatedExpense,
    });
  } catch (error: unknown) {
    console.error("Create expense error:", error);

    return res.status(500).json({
      success: false,
      message: "We couldn't add the expense. Please try again. ⚠️",
    });
  }
};

// ====================
// Get All Expenses
// ====================

const getAllExpenses = async (req: Request, res: Response) => {
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

    const expenses = await Expense.find({ userId })
      .populate("categoryId", "name icon color")
      .sort({
        expenseDate: -1,
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      message: "Expenses loaded successfully. 💰",
      count: expenses.length,
      data: expenses,
    });
  } catch (error: unknown) {
    console.error("Get expenses error:", error);

    return res.status(500).json({
      success: false,
      message: "We couldn't load the expenses. Please try again. ⚠️",
    });
  }
};

// ====================
// Get Single Expense
// ====================

const getExpenseById = async (req: Request, res: Response) => {
  try {
    const expenseId = req.params.expenseId as string;
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

    if (!mongoose.Types.ObjectId.isValid(expenseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid expense ID. ⚠️",
      });
    }

    const expense = await Expense.findOne({
      _id: expenseId,
      userId,
    }).populate("categoryId", "name icon color");

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found. 💰",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Expense loaded successfully. 💰",
      data: expense,
    });
  } catch (error: unknown) {
    console.error("Get expense error:", error);

    return res.status(500).json({
      success: false,
      message: "We couldn't load the expense. Please try again. ⚠️",
    });
  }
};

// ====================
// Update Expense
// ====================

const updateExpense = async (req: Request, res: Response) => {
  try {
    const expenseId = req.params.expenseId as string;
    const { userId } = req.body as { userId?: string };

    const { categoryId, amount, expenseDate, note } =
      req.body as UpdateExpenseRequest;

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

    if (!mongoose.Types.ObjectId.isValid(expenseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid expense ID. ⚠️",
      });
    }

    if (
      categoryId === undefined &&
      amount === undefined &&
      expenseDate === undefined &&
      note === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide something to update. ⚠️",
      });
    }

    const expense = await Expense.findOne({
      _id: expenseId,
      userId,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found. 💰",
      });
    }

    // Update category
    if (categoryId !== undefined) {
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid category ID. ⚠️",
        });
      }

      const category = await Category.findOne({
        _id: categoryId,
        userId,
      });

      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found for this user. 📁",
        });
      }

      expense.categoryId = new mongoose.Types.ObjectId(categoryId);
    }

    // Update amount
    if (amount !== undefined) {
      if (typeof amount !== "number" || amount <= 0) {
        return res.status(400).json({
          success: false,
          message: "Expense amount must be greater than ₹0. 💰",
        });
      }

      expense.amount = amount;
    }

    // Update date
    if (expenseDate !== undefined) {
      const parsedDate = new Date(expenseDate);

      if (Number.isNaN(parsedDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid expense date. 📅",
        });
      }

      expense.expenseDate = parsedDate;
    }

    // Update note
    if (note !== undefined) {
      expense.note = note.trim();
    }

    await expense.save();

    const updatedExpense = await Expense.findById(expense._id).populate(
      "categoryId",
      "name icon color",
    );

    return res.status(200).json({
      success: true,
      message: "Expense updated successfully. ✨",
      data: updatedExpense,
    });
  } catch (error: unknown) {
    console.error("Update expense error:", error);

    return res.status(500).json({
      success: false,
      message: "We couldn't update the expense. Please try again. ⚠️",
    });
  }
};

// ====================
// Delete Expense
// ====================

const deleteExpense = async (req: Request, res: Response) => {
  try {
    const expenseId = req.params.expenseId as string;
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

    if (!mongoose.Types.ObjectId.isValid(expenseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid expense ID. ⚠️",
      });
    }

    const expense = await Expense.findOneAndDelete({
      _id: expenseId,
      userId,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found. 💰",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Expense deleted successfully. 🗑️",
    });
  } catch (error: unknown) {
    console.error("Delete expense error:", error);

    return res.status(500).json({
      success: false,
      message: "We couldn't delete the expense. Please try again. ⚠️",
    });
  }
};

// ====================
// Get Recent Expenses
// ====================

const getRecentExpenses = async (req: Request, res: Response) => {
  try {
    const { userId, limit } = req.query;

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

    const parsedLimit = limit ? Number(limit) : 10;

    if (!Number.isInteger(parsedLimit) || parsedLimit < 1 || parsedLimit > 50) {
      return res.status(400).json({
        success: false,
        message: "Limit must be between 1 and 50. ⚠️",
      });
    }

    const expenses = await Expense.find({ userId })
      .populate("categoryId", "name icon color")
      .sort({
        expenseDate: -1,
        createdAt: -1,
      })
      .limit(parsedLimit);

    return res.status(200).json({
      success: true,
      message: "Recent expenses loaded successfully. 💰",
      count: expenses.length,
      data: expenses,
    });
  } catch (error: unknown) {
    console.error("Get recent expenses error:", error);

    return res.status(500).json({
      success: false,
      message: "We couldn't load recent expenses. Please try again. ⚠️",
    });
  }
};

// ====================
// Filter Expenses
// ====================

const filterExpenses = async (req: Request, res: Response) => {
  try {
    const { userId, categoryId, startDate, endDate } = req.query;

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

    const filter: Record<string, unknown> = {
      userId,
    };

    // Category filter
    if (categoryId) {
      if (
        typeof categoryId !== "string" ||
        !mongoose.Types.ObjectId.isValid(categoryId)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid category ID. ⚠️",
        });
      }

      filter.categoryId = categoryId;
    }

    // Date filter
    if (startDate || endDate) {
      const dateFilter: Record<string, Date> = {};

      if (startDate && typeof startDate === "string") {
        const start = new Date(startDate);

        if (Number.isNaN(start.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid start date. 📅",
          });
        }

        start.setHours(0, 0, 0, 0);
        dateFilter.$gte = start;
      }

      if (endDate && typeof endDate === "string") {
        const end = new Date(endDate);

        if (Number.isNaN(end.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid end date. 📅",
          });
        }

        end.setHours(23, 59, 59, 999);
        dateFilter.$lte = end;
      }

      filter.expenseDate = dateFilter;
    }

    const expenses = await Expense.find(filter)
      .populate("categoryId", "name icon color")
      .sort({
        expenseDate: -1,
      });

    const totalExpense = expenses.reduce(
      (total, expense) => total + expense.amount,
      0,
    );

    return res.status(200).json({
      success: true,
      message: "Expenses filtered successfully. 🔎",
      count: expenses.length,
      totalExpense,
      data: expenses,
    });
  } catch (error: unknown) {
    console.error("Filter expenses error:", error);

    return res.status(500).json({
      success: false,
      message: "We couldn't filter the expenses. Please try again. ⚠️",
    });
  }
};

// ====================
// Monthly Summary
// ====================

const getMonthlySummary = async (req: Request, res: Response) => {
  try {
    const { userId, month } = req.query;

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

    // Expected format: YYYY-MM
    const selectedMonth =
      typeof month === "string" ? month : new Date().toISOString().slice(0, 7);

    if (!/^\d{4}-\d{2}$/.test(selectedMonth)) {
      return res.status(400).json({
        success: false,
        message: "Month must be in YYYY-MM format. 📅",
      });
    }

    const [year, monthNumber] = selectedMonth.split("-").map(Number);

    const startDate = new Date(year, monthNumber - 1, 1);
    const endDate = new Date(year, monthNumber, 1);

    const summary = await Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          expenseDate: {
            $gte: startDate,
            $lt: endDate,
          },
        },
      },

      {
        $group: {
          _id: null,
          totalExpense: {
            $sum: "$amount",
          },
          expenseCount: {
            $sum: 1,
          },
        },
      },
    ]);

    const categorySummary = await Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          expenseDate: {
            $gte: startDate,
            $lt: endDate,
          },
        },
      },

      {
        $group: {
          _id: "$categoryId",
          totalAmount: {
            $sum: "$amount",
          },
          expenseCount: {
            $sum: 1,
          },
        },
      },

      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "category",
        },
      },

      {
        $unwind: "$category",
      },

      {
        $project: {
          _id: 0,
          categoryId: "$_id",
          categoryName: "$category.name",
          icon: "$category.icon",
          color: "$category.color",
          totalAmount: 1,
          expenseCount: 1,
        },
      },

      {
        $sort: {
          totalAmount: -1,
        },
      },
    ]);

    const totalExpense = summary[0]?.totalExpense || 0;
    const expenseCount = summary[0]?.expenseCount || 0;

    return res.status(200).json({
      success: true,
      message: "Monthly summary loaded successfully. 📊",
      data: {
        month: selectedMonth,
        totalExpense,
        expenseCount,
        byCategory: categorySummary,
      },
    });
  } catch (error: unknown) {
    console.error("Monthly summary error:", error);

    return res.status(500).json({
      success: false,
      message: "We couldn't load the monthly summary. Please try again. ⚠️",
    });
  }
};

// ====================
// Exports
// ====================

export {
  createExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getRecentExpenses,
  filterExpenses,
  getMonthlySummary,
};
