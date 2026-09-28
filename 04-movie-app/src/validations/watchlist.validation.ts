import { z } from "zod";

const watchlistMovieSchema = z.object({
  body: z.object({}).optional(),

  params: z.object({
    movieId: z
      .string()
      .regex(/^[a-fA-F0-9]{24}$/, "Please provide a valid movie ID."),
  }),

  query: z.object({}).optional(),
});

export { watchlistMovieSchema };
