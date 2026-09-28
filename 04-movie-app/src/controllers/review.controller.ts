import mongoose from "mongoose";
import Review from "../models/review.model";
import Movie from "../models/movie.model";
import { asyncHandler } from "../utils/async-handler";
import { ApiError } from "../utils/api-error";
import { ApiResponse } from "../utils/api-response";

// 1. Add Review
const addReview = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  const { movieId } = req.params;
  const { rating, comment } = req.body;

  if (!userId) {
    throw new ApiError(401, "Please log in to review movies.");
  }

  const movie = await Movie.exists({ _id: movieId });

  if (!movie) {
    throw new ApiError(404, "Movie not found.");
  }

  const existingReview = await Review.exists({
    userId,
    movieId,
  });

  if (existingReview) {
    throw new ApiError(
      409,
      "You have already reviewed this movie. You can update your existing review.",
    );
  }

  let review = await Review.create({
    userId,
    movieId,
    rating,
    comment,
  });

  return res
    .status(201)
    .json(new ApiResponse(true, "Review added successfully.", review));
});

// 2. Get All Reviews for a Movie
const getMovieReviews = asyncHandler(async (req, res) => {
  const { movieId } = req.params;

  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));

  const movie = await Movie.exists({ _id: movieId });

  if (!movie) {
    throw new ApiError(404, "Movie not found.");
  }

  const filter = { movieId };

  const [reviews, total, ratingStats] = await Promise.all([
    Review.find(filter)
      .populate("userId", "name avatar")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),

    Review.countDocuments(filter),

    Review.aggregate([
      {
        $match: {
          movieId: new mongoose.Types.ObjectId(movieId),
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalRatings: { $sum: 1 },
        },
      },
    ]),
  ]);

  return res.status(200).json(
    new ApiResponse(true, "Movie reviews fetched successfully.", {
      reviews,
      averageRating: Number((ratingStats[0]?.averageRating ?? 0).toFixed(1)),
      totalRatings: ratingStats[0]?.totalRatings ?? 0,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }),
  );
});

// 3. Get My Reviews
const getMyReviews = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new ApiError(401, "Please log in.");
  }

  const reviews = await Review.find({ userId })
    .populate("movieId", "title thumbnail year")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(true, "Your reviews fetched successfully.", reviews));
});

// 4. Update My Review
const updateReview = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  const { reviewId } = req.params;
  const { rating, comment } = req.body;

  if (!userId) {
    throw new ApiError(401, "Please log in.");
  }

  const review = await Review.findOne({
    _id: reviewId,
    userId,
  });

  if (!review) {
    throw new ApiError(
      404,
      "Review not found or you do not have permission to edit it.",
    );
  }

  if (rating !== undefined) {
    review.rating = rating;
  }

  if (comment !== undefined) {
    review.comment = comment;
  }

  await review.save();

  return res
    .status(200)
    .json(new ApiResponse(true, "Review updated successfully.", review));
});

// 5. Delete My Review
const deleteReview = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  const { reviewId } = req.params;

  if (!userId) {
    throw new ApiError(401, "Please log in.");
  }

  const review = await Review.findOneAndDelete({
    _id: reviewId,
    userId,
  });

  if (!review) {
    throw new ApiError(
      404,
      "Review not found or you do not have permission to delete it.",
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(true, "Review deleted successfully.", null));
});

export { addReview, getMovieReviews, getMyReviews, updateReview, deleteReview };
