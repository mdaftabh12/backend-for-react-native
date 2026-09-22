import { Request, Response } from "express";
import mongoose from "mongoose";
import Todo from "../models/todo.model";

// ====================
// Todo Types
// ====================

export type TodoPriority = "LOW" | "MEDIUM" | "HIGH";

export type TodoStatus = "PENDING" | "ACTIVE" | "COMPLETED";

// ====================
// Request Types
// ====================

export interface CreateTodoRequest {
  title: string;
  description?: string;
  todoDate?: Date;
  priority?: TodoPriority;
  status?: TodoStatus;
}

export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  todoDate?: Date;
  priority?: TodoPriority;
  status?: TodoStatus;
}

export interface FilterTodoRequest {
  priority?: TodoPriority;
  status?: TodoStatus;
}

// ====================
// Create Todo
// ====================

const createTodo = async (req: Request, res: Response) => {
  try {
    const { title, description, todoDate, priority, status } =
      req.body as CreateTodoRequest;

    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter a title for your todo. ✏️",
      });
    }

    if (title.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Todo title must be at least 2 characters long. ✏️",
      });
    }

    if (todoDate !== undefined) {
      const parsedDate = new Date(todoDate);

      if (Number.isNaN(parsedDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Please select a valid date for your todo. 📅",
        });
      }
    }

    const todo = await Todo.create({
      title: title.trim(),
      description: description?.trim() || undefined,
      todoDate,
      priority,
      status,
    });

    return res.status(201).json({
      success: true,
      message: "Your todo has been created successfully. 🎉",
      data: todo,
    });
  } catch (error: unknown) {
    console.error("Create todo error:", error);

    return res.status(500).json({
      success: false,
      message: "We couldn't create your todo. Please try again. ⚠️",
    });
  }
};

// ====================
// Get All Todos
// ====================

const getAllTodo = async (req: Request, res: Response) => {
  try {
    const todos = await Todo.find().sort({
      todoDate: 1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      message: todos.length
        ? "Your todos have been loaded successfully. 📋"
        : "You don't have any todos yet. Create your first todo! ✨",
      count: todos.length,
      data: todos,
    });
  } catch (error: unknown) {
    console.error("Get all todos error:", error);

    return res.status(500).json({
      success: false,
      message: "We couldn't load your todos. Please try again. ⚠️",
    });
  }
};

// ====================
// Get Todo By ID
// ====================

const getTodo = async (req: Request, res: Response) => {
  try {
    const todoId = req.params.todoId as string;

    if (!mongoose.Types.ObjectId.isValid(todoId)) {
      return res.status(400).json({
        success: false,
        message: "The todo ID is invalid. Please try again. ⚠️",
      });
    }

    const todo = await Todo.findById(todoId);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "We couldn't find this todo. It may have been deleted. 📝",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Your todo has been loaded successfully. 📋",
      data: todo,
    });
  } catch (error: unknown) {
    console.error("Get todo error:", error);

    return res.status(500).json({
      success: false,
      message: "We couldn't load this todo. Please try again. ⚠️",
    });
  }
};

// ====================
// Update Todo
// ====================

const updateTodo = async (req: Request, res: Response) => {
  try {
    const todoId = req.params.todoId as string;

    const { title, description, todoDate, priority, status } =
      req.body as UpdateTodoRequest;

    if (!mongoose.Types.ObjectId.isValid(todoId)) {
      return res.status(400).json({
        success: false,
        message: "The todo ID is invalid. Please try again. ⚠️",
      });
    }

    if (
      title === undefined &&
      description === undefined &&
      todoDate === undefined &&
      priority === undefined &&
      status === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide something to update. ✏️",
      });
    }

    if (title !== undefined && !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Todo title cannot be empty. ✏️",
      });
    }

    if (title !== undefined && title.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Todo title must be at least 2 characters long. ✏️",
      });
    }

    if (todoDate !== undefined) {
      const parsedDate = new Date(todoDate);

      if (Number.isNaN(parsedDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Please select a valid date for your todo. 📅",
        });
      }
    }

    const updateData: Record<string, unknown> = {};

    if (title !== undefined) {
      updateData.title = title.trim();
    }

    if (description !== undefined) {
      updateData.description = description.trim();
    }

    if (todoDate !== undefined) {
      updateData.todoDate = todoDate;
    }

    if (priority !== undefined) {
      updateData.priority = priority;
    }

    if (status !== undefined) {
      updateData.status = status;
    }

    const todo = await Todo.findByIdAndUpdate(
      todoId,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "We couldn't find this todo. It may have been deleted. 📝",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Your todo has been updated successfully. ✨",
      data: todo,
    });
  } catch (error: unknown) {
    console.error("Update todo error:", error);

    return res.status(500).json({
      success: false,
      message: "We couldn't update your todo. Please try again. ⚠️",
    });
  }
};

// ====================
// Delete Todo
// ====================

const deleteTodo = async (req: Request, res: Response) => {
  try {
    const todoId = req.params.todoId as string;

    if (!mongoose.Types.ObjectId.isValid(todoId)) {
      return res.status(400).json({
        success: false,
        message: "The todo ID is invalid. Please try again. ⚠️",
      });
    }

    const todo = await Todo.findByIdAndDelete(todoId);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message:
          "We couldn't find this todo. It may have already been deleted. 📝",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Your todo has been deleted successfully. 🗑️",
    });
  } catch (error: unknown) {
    console.error("Delete todo error:", error);

    return res.status(500).json({
      success: false,
      message: "We couldn't delete your todo. Please try again. ⚠️",
    });
  }
};

// ====================
// Filter Todos
// ====================

const filter = async (req: Request, res: Response) => {
  try {
    const { priority, status } = req.body as FilterTodoRequest;

    if (!priority && !status) {
      return res.status(400).json({
        success: false,
        message: "Please select a priority or status to filter your todos. 🔎",
      });
    }

    const filterQuery: Record<string, unknown> = {};

    if (priority) {
      filterQuery.priority = priority;
    }

    if (status) {
      filterQuery.status = status;
    }

    const todos = await Todo.find(filterQuery).sort({
      todoDate: 1,
      createdAt: -1,
    });

    if (!todos.length) {
      return res.status(404).json({
        success: false,
        message: "No todos match the selected filters. 🔎",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Your filtered todos have been loaded successfully. 🔎",
      count: todos.length,
      data: todos,
    });
  } catch (error: unknown) {
    console.error("Filter todo error:", error);

    return res.status(500).json({
      success: false,
      message: "We couldn't filter your todos. Please try again. ⚠️",
    });
  }
};

// ====================
// Search Todos
// ====================

const search = async (req: Request, res: Response) => {
  try {
    const searchText = req.query.search;

    if (!searchText || typeof searchText !== "string") {
      return res.status(400).json({
        success: false,
        message: "Please enter something to search. 🔎",
      });
    }

    const trimmedSearch = searchText.trim();

    if (!trimmedSearch) {
      return res.status(400).json({
        success: false,
        message: "Please enter something to search. 🔎",
      });
    }

    // Escape regex special characters
    const escapedSearch = trimmedSearch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const searchRegex = new RegExp(escapedSearch, "i");

    const todos = await Todo.find({
      $or: [{ title: searchRegex }, { description: searchRegex }],
    }).sort({
      createdAt: -1,
    });

    if (!todos.length) {
      return res.status(404).json({
        success: false,
        message: `No todos found for "${trimmedSearch}". 🔎`,
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: `Found ${todos.length} todo${
        todos.length === 1 ? "" : "s"
      } matching your search. 🔎`,
      count: todos.length,
      data: todos,
    });
  } catch (error: unknown) {
    console.error("Search todo error:", error);

    return res.status(500).json({
      success: false,
      message: "We couldn't search your todos. Please try again. ⚠️",
    });
  }
};

// ====================
// Exports
// ====================

export {
  createTodo,
  getAllTodo,
  getTodo,
  updateTodo,
  deleteTodo,
  filter,
  search,
};
