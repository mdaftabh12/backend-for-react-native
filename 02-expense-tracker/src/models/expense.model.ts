import mongoose, { Document, Schema } from "mongoose";

export interface IExpense extends Document {
  userId: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId;
  amount: number;
  expenseDate: Date;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const expenseSchema = new Schema<IExpense>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },

    amount: {
      type: Number,
      required: [true, "Expense amount is required"],
      min: [0.01, "Expense amount must be greater than 0"],
    },

    expenseDate: {
      type: Date,
      required: [true, "Expense date is required"],
      index: true,
    },

    note: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  },
);

// Useful for user's expense listing
expenseSchema.index({
  userId: 1,
  expenseDate: -1,
});

// Useful for category-based filtering
expenseSchema.index({
  userId: 1,
  categoryId: 1,
});

const Expense = mongoose.model<IExpense>("Expense", expenseSchema);

export default Expense;
