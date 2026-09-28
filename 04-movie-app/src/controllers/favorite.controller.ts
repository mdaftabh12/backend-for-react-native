import Favorite from "../models/favorite.model";
import Movie from "../models/movie.model";
import { asyncHandler } from "../utils/async-handler";
import { ApiError } from "../utils/api-error";
import { ApiResponse } from "../utils/api-response";

// --------------------------------
// Add Movie to Favorites
// --------------------------------
const addFavorite = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  const { movieId } = req.params;

  if (!userId) {
    throw new ApiError(401, "Please log in to add movies to your favorites.");
  }

  const movie = await Movie.findById(movieId);

  if (!movie) {
    throw new ApiError(404, "Movie not found. Please try again.");
  }

  const existingFavorite = await Favorite.findOne({
    userId,
    movieId,
  });

  if (existingFavorite) {
    throw new ApiError(409, "This movie is already in your favorites.");
  }

  let favorite = await Favorite.create({
    userId,
    movieId,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        true,
        "Movie added to your favorites successfully.",
        favorite,
      ),
    );
});

// --------------------------------
// Get My Favorite Movies
// --------------------------------
const getMyFavorites = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new ApiError(401, "Please log in to view your favorites.");
  }

  const favorites = await Favorite.find({
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
      new ApiResponse(
        true,
        "Your favorite movies fetched successfully.",
        favorites,
      ),
    );
});

// --------------------------------
// Remove Movie from Favorites
// --------------------------------
const removeFavorite = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  const { movieId } = req.params;

  if (!userId) {
    throw new ApiError(401, "Please log in to continue.");
  }

  const favorite = await Favorite.findOneAndDelete({
    userId,
    movieId,
  });

  if (!favorite) {
    throw new ApiError(404, "This movie is not in your favorites.");
  }

  return res.status(200).json(
    new ApiResponse(true, "Movie removed from your favorites successfully.", {
      movieId,
      isFavorite: false,
    }),
  );
});

export { addFavorite, getMyFavorites, removeFavorite };
