import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  isDisabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    isDisabled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Category = mongoose.model<ICategory>("Category", categorySchema);

export default Category;
