import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  userId: mongoose.Types.ObjectId;
  movieId: mongoose.Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    movieId: {
      type: mongoose.Types.ObjectId,
      ref: "Movie",
    },
    rating: {
      type: Number,
      default: 1,
    },
    comment: {
      type: String,
    },
  },
  { timestamps: true },
);

const Review = mongoose.model<IReview>("Review", reviewSchema);

export default Review;
