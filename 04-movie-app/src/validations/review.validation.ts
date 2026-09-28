import { z } from "zod";

const objectId = z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid ID.");

const reviewFields = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().max(1000).optional(),
});

export const createReviewSchema = z.object({
  body: reviewFields,
  params: z.object({
    movieId: objectId,
  }),
  query: z.object({}).optional(),
});

export const updateReviewSchema = z.object({
  body: reviewFields
    .partial()
    .refine(
      (data) => Object.keys(data).length > 0,
      "Provide at least one field to update.",
    ),
  params: z.object({
    reviewId: objectId,
  }),
  query: z.object({}).optional(),
});

export const reviewIdSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    reviewId: objectId,
  }),
  query: z.object({}).optional(),
});

export const movieReviewsSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    movieId: objectId,
  }),
  query: z
    .object({
      page: z.coerce.number().int().min(1).optional(),
      limit: z.coerce.number().int().min(1).max(50).optional(),
    })
    .optional(),
});
