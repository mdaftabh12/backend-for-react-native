import { z } from "zod";

// --------------------------------
// ObjectId Validation
// --------------------------------
const objectId = z
  .string({ message: "ID is required" })
  .regex(/^[a-fA-F0-9]{24}$/, "Invalid ID");

// --------------------------------
// Parse Array from Form Data
// --------------------------------
const parseArray = (value: unknown) => {
  if (typeof value !== "string") return value;

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

// --------------------------------
// Movie Fields
// --------------------------------
const movieFields = {
  title: z
    .string({ message: "Title is required" })
    .trim()
    .min(2, "Title must be at least 2 characters"),

  rating: z.coerce
    .number({ message: "Rating is required" })
    .min(0, "Rating cannot be less than 0")
    .max(10, "Rating cannot be greater than 10"),

  year: z.coerce
    .number({ message: "Year is required" })
    .int("Year must be a whole number")
    .min(1888, "Invalid release year")
    .max(2100, "Invalid release year"),

  duration: z
    .string({ message: "Duration is required" })
    .trim()
    .min(1, "Duration is required"),

  description: z
    .string({ message: "Description is required" })
    .trim()
    .min(10, "Description must be at least 10 characters"),

  director: z
    .string({ message: "Director is required" })
    .trim()
    .min(2, "Director must be at least 2 characters"),

  language: z.preprocess(
    parseArray,
    z
      .array(
        z
          .string({ message: "At least one language is required" })
          .trim()
          .min(1, "Language cannot be empty"),
      )
      .min(1, "At least one language is required"),
  ),

  releaseDate: z.coerce.date({
    message: "Release date is required",
  }),

  categories: z.preprocess(
    parseArray,
    z.array(objectId).min(1, "At least one category is required"),
  ),
};

// --------------------------------
// Create Movie
// --------------------------------
export const createMovieSchema = z.object({
  body: z.object({
    ...movieFields,

    rating: movieFields.rating.optional().default(0),
  }),

  params: z.object({}),
  query: z.object({}),
});

// --------------------------------
// Update Movie
// --------------------------------
export const updateMovieSchema = z.object({
  body: z.object({
    title: movieFields.title.optional(),
    rating: movieFields.rating.optional(),
    year: movieFields.year.optional(),
    duration: movieFields.duration.optional(),
    description: movieFields.description.optional(),
    director: movieFields.director.optional(),
    language: movieFields.language.optional(),
    releaseDate: movieFields.releaseDate.optional(),
    categories: movieFields.categories.optional(),
  }),

  params: z.object({
    id: objectId,
  }),

  query: z.object({}),
});

// --------------------------------
// Movie ID
// --------------------------------
export const movieIdSchema = z.object({
  body: z.object({}),

  params: z.object({
    id: objectId,
  }),

  query: z.object({}),
});

// --------------------------------
// Get All Movies
// --------------------------------
export const getMoviesSchema = z.object({
  body: z.object({}),

  params: z.object({}),

  query: z.object({
    page: z.coerce
      .number({ message: "Page must be a number" })
      .int("Page must be a whole number")
      .min(1, "Page must be at least 1")
      .default(1),

    limit: z.coerce
      .number({ message: "Limit must be a number" })
      .int("Limit must be a whole number")
      .min(1, "Limit must be at least 1")
      .max(50, "Limit cannot be greater than 50")
      .default(10),

    search: z.string().trim().optional(),
  }),
});

// --------------------------------
// Movies By Category
// --------------------------------
export const moviesByCategorySchema = z.object({
  body: z.object({}),

  params: z.object({
    categoryId: objectId,
  }),

  query: z.object({}),
});
