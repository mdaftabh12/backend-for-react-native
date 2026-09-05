import mongoose, { Document, Schema } from "mongoose";

export interface ICategory extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  icon?: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    icon: {
      type: String,
      trim: true,
      default: "📁",
    },

    color: {
      type: String,
      trim: true,
      default: "#3B82F6",
    },
  },
  {
    timestamps: true,
  },
);

const Category = mongoose.model<ICategory>("Category", categorySchema);

export default Category;
