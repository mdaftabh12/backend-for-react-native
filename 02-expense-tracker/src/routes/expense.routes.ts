import { Router } from "express";

import {
  createExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getRecentExpenses,
  filterExpenses,
  getMonthlySummary,
} from "../controllers/expense.controller";

const router = Router();

// ====================
// Expense Routes
// ====================

// Create expense
router.post("/create-expense", createExpense);

// Get all expenses
router.get("/get-all-expenses", getAllExpenses);

// Get recent expenses
router.get("/get-recent-expenses", getRecentExpenses);

// Filter expenses
router.get("/filter-expenses", filterExpenses);

// Monthly summary
router.get("/get-monthly-summary", getMonthlySummary);

// Get single expense
router.get("/get-expense/:expenseId", getExpenseById);

// Update expense
router.put("/update-expense/:expenseId", updateExpense);

// Delete expense
router.delete("/delete-expense/:expenseId", deleteExpense);

export default router;
