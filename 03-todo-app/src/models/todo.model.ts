import mongoose, { Document, Schema } from "mongoose";

// ====================
// Todo Types
// ====================

export type TodoPriority = "LOW" | "MEDIUM" | "HIGH";

export type TodoStatus = "PENDING" | "ACTIVE" | "COMPLETED";

// ====================
// Todo Interface
// ====================

export interface ITodo extends Document {
  title: string;
  description?: string;
  todoDate: Date;
  priority: TodoPriority;
  status: TodoStatus;
  createdAt: Date;
  updatedAt: Date;
}

// ====================
// Todo Schema
// ====================

const todoSchema = new Schema<ITodo>(
  {
    title: {
      type: String,
      required: [true, "Todo title is required"],
      trim: true,
      minlength: [2, "Todo title must be at least 2 characters"],
      maxlength: [100, "Todo title cannot exceed 100 characters"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, "Todo description cannot exceed 500 characters"],
    },

    todoDate: {
      type: Date,
      required: [true, "Todo date is required"],
      default: Date.now,
      index: true,
    },

    priority: {
      type: String,
      enum: {
        values: ["LOW", "MEDIUM", "HIGH"],
        message: "Priority must be LOW, MEDIUM, or HIGH",
      },
      default: "MEDIUM",
      index: true,
    },

    status: {
      type: String,
      enum: {
        values: ["PENDING", "ACTIVE", "COMPLETED"],
        message: "Status must be PENDING, ACTIVE, or COMPLETED",
      },
      default: "PENDING",
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

// ====================
// Todo Model
// ====================

const Todo = mongoose.model<ITodo>("Todo", todoSchema);

export default Todo;
