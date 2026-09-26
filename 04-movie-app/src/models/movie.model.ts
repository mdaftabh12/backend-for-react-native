import mongoose, { Document, Schema } from "mongoose";

export interface IMovie extends Document {
  title: string;
  thumbnail: string;
  video: string[];
  rating: number;
  year: number;
  duration: string;
  description: string;
  director: string;
  language: string[];
  releaseDate: Date;
  categories: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const movieSchema = new Schema<IMovie>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    thumbnail: {
      type: String,
      required: true,
      trim: true,
    },

    video: {
      type: [String],
      default: [],
    },

    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },

    year: {
      type: Number,
      required: true,
    },

    duration: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    director: {
      type: String,
      required: true,
      trim: true,
    },

    language: {
      type: [String],
      default: [],
    },

    releaseDate: {
      type: Date,
      required: true,
    },

    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Movie = mongoose.model<IMovie>("Movie", movieSchema);

export default Movie;
