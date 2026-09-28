import Watchlist from "../models/watchlist.model";
import Movie from "../models/movie.model";

import { asyncHandler } from "../utils/async-handler";
import { ApiError } from "../utils/api-error";
import { ApiResponse } from "../utils/api-response";

// --------------------------------
// Add Movie to Watchlist
// --------------------------------
const addToWatchlist = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  const { movieId } = req.params;

  if (!userId) {
    throw new ApiError(401, "Please log in to add movies to your watchlist.");
  }

  const movie = await Movie.findById(movieId);

  if (!movie) {
    throw new ApiError(404, "Movie not found. Please try again.");
  }

  const existingMovie = await Watchlist.findOne({
    userId,
    movieId,
  });

  if (existingMovie) {
    throw new ApiError(409, "This movie is already in your watchlist.");
  }

  let watchlist;

  try {
    watchlist = await Watchlist.create({
      userId,
      movieId,
    });
  } catch (error: any) {
    if (error?.code === 11000) {
      throw new ApiError(409, "This movie is already in your watchlist.");
    }

    throw error;
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        true,
        "Movie added to your watchlist successfully.",
        watchlist,
      ),
    );
});

// --------------------------------
// Get My Watchlist
// --------------------------------
const getMyWatchlist = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new ApiError(401, "Please log in to view your watchlist.");
  }

  const watchlist = await Watchlist.find({
    userId,
  })
    .populate({
      path: "movieId",
      select:
        "title thumbnail rating year duration description director language releaseDate categories",
      populate: {
        path: "categories",
        select: "name",
      },
    })
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(true, "Your watchlist fetched successfully.", watchlist),
    );
});

// --------------------------------
// Remove Movie from Watchlist
// --------------------------------
const removeFromWatchlist = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  const { movieId } = req.params;

  if (!userId) {
    throw new ApiError(401, "Please log in to continue.");
  }

  const watchlist = await Watchlist.findOneAndDelete({
    userId,
    movieId,
  });

  if (!watchlist) {
    throw new ApiError(404, "This movie is not in your watchlist.");
  }

  return res.status(200).json(
    new ApiResponse(true, "Movie removed from your watchlist successfully.", {
      movieId,
      isWatchlisted: false,
    }),
  );
});

export { addToWatchlist, getMyWatchlist, removeFromWatchlist };
