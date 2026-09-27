import { z } from "zod";

const updateUserSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .optional(),

    email: z
      .string()
      .trim()
      .email("Please enter a valid email address")
      .toLowerCase()
      .optional(),
  }),

  params: z.object({}),
  query: z.object({}),
});

export { updateUserSchema };
