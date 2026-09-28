import Movie from "../models/movie.model";
import Category from "../models/category.model";

import { asyncHandler } from "../utils/async-handler";
import { ApiError } from "../utils/api-error";
import { ApiResponse } from "../utils/api-response";

type MovieFiles = {
  thumbnail?: Express.Multer.File[];
  video?: Express.Multer.File[];
};

// --------------------------------
// Helper: Validate Categories
// --------------------------------
const checkCategories = async (categories: string[]) => {
  const uniqueIds = [...new Set(categories)];

  if (uniqueIds.length !== categories.length) {
    throw new ApiError(400, "Please select each category only once.");
  }

  const count = await Category.countDocuments({
    _id: { $in: uniqueIds },
    isActive: true,
  });

  if (count !== uniqueIds.length) {
    throw new ApiError(400, "Please select valid and active categories.");
  }
};

// --------------------------------
// 1. Create Movie
// --------------------------------
const createMovie = asyncHandler(async (req, res) => {
  const {
    title,
    rating,
    year,
    duration,
    description,
    director,
    language,
    releaseDate,
    categories,
  } = req.body;

  const files = req.files as MovieFiles | undefined;

  const thumbnail = files?.thumbnail?.[0];
  const videos = files?.video ?? [];

  if (!thumbnail) {
    throw new ApiError(400, "Please upload a movie thumbnail.");
  }

  if (videos.length === 0) {
    throw new ApiError(400, "Please upload at least one movie video.");
  }

  await checkCategories(categories);
  
  const movie = await Movie.create({
    title,
    rating: rating ?? 0,
    year,
    duration,
    description,
    director,
    language,
    releaseDate,
    categories,
    thumbnail: `/public/${thumbnail.filename}`,
    video: videos.map((file) => `/public/${file.filename}`),
  });

  return res
    .status(201)
    .json(new ApiResponse(true, "Movie added successfully.", movie));
});

// --------------------------------
// 2. Get All Movies
// --------------------------------
const getAllMovies = asyncHandler(async (req, res) => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 10);
  const search = String(req.query.search ?? "");

  const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const filter = search
    ? { title: { $regex: escapedSearch, $options: "i" } }
    : {};

  const skip = (page - 1) * limit;

  const [movies, total] = await Promise.all([
    Movie.find(filter)
      .populate("categories", "name isActive")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Movie.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(true, "Movies fetched successfully.", {
      movies,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }),
  );
});

// --------------------------------
// 3. Get Movie By ID
// --------------------------------
const getMovieById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const movie = await Movie.findById(id).populate(
    "categories",
    "name isActive",
  );

  if (!movie) {
    throw new ApiError(404, "Movie not found. Please try again.");
  }

  return res
    .status(200)
    .json(new ApiResponse(true, "Movie details fetched successfully.", movie));
});

// --------------------------------
// 4. Update Movie
// --------------------------------
const updateMovie = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const movie = await Movie.findById(id);

  if (!movie) {
    throw new ApiError(404, "Movie not found. Please try again.");
  }

  const {
    title,
    rating,
    year,
    duration,
    description,
    director,
    language,
    releaseDate,
    categories,
  } = req.body;

  if (categories !== undefined) {
    await checkCategories(categories);
    movie.categories = categories;
  }

  if (title !== undefined) movie.title = title;
  if (rating !== undefined) movie.rating = rating;
  if (year !== undefined) movie.year = year;
  if (duration !== undefined) movie.duration = duration;

  if (description !== undefined) {
    movie.description = description;
  }

  if (director !== undefined) movie.director = director;
  if (language !== undefined) movie.language = language;

  if (releaseDate !== undefined) {
    movie.releaseDate = releaseDate;
  }

  // Optional file updates
  const files = req.files as MovieFiles | undefined;

  const thumbnail = files?.thumbnail?.[0];
  const videos = files?.video ?? [];

  if (thumbnail) {
    movie.thumbnail = `/uploads/thumbnails/${thumbnail.filename}`;
  }

  if (videos.length > 0) {
    movie.video = videos.map((file) => `/uploads/videos/${file.filename}`);
  }

  await movie.save();

  await movie.populate("categories", "name isActive");

  return res
    .status(200)
    .json(new ApiResponse(true, "Movie updated successfully.", movie));
});

// --------------------------------
// 5. Delete Movie
// --------------------------------
const deleteMovie = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const movie = await Movie.findByIdAndDelete(id);

  if (!movie) {
    throw new ApiError(
      404,
      "Movie not found. It may have already been deleted.",
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(true, "Movie deleted successfully.", null));
});

// --------------------------------
// 6. Get Movies By Category
// --------------------------------
const getMoviesByCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const category = await Category.findById(categoryId);

  if (!category) {
    throw new ApiError(404, "Category not found. Please try again.");
  }

  const movies = await Movie.find({
    categories: categoryId,
  })
    .populate("categories", "name isActive")
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(true, "Movies fetched successfully.", {
      category: {
        id: category._id,
        name: category.name,
      },
      movies,
    }),
  );
});

export {
  createMovie,
  getAllMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
  getMoviesByCategory,
};
