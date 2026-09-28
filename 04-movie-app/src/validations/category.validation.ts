import { z } from "zod";

const categoryIdSchema = z.object({
  params: z.object({
    id: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Please provide a valid category ID."),
  }),

  body: z.object({}),
  query: z.object({}),
});

const createCategorySchema = z.object({
  body: z.object({
    name: z
      .string({
        message: "Name is required",
      })
      .trim()
      .min(2, "Category name must be at least 2 characters.")
      .max(20, "Category name cannot exceed 20 characters."),
  }),

  params: z.object({}),
  query: z.object({}),
});

const updateCategorySchema = z.object({
  body: z.object({
    name: z
      .string({
        message: "Name is required",
      })
      .trim()
      .min(2, "Category name must be at least 2 characters.")
      .max(20, "Category name cannot exceed 20 characters."),
  }),

  params: z.object({
    id: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Please provide a valid category ID."),
  }),

  query: z.object({}),
});

export { categoryIdSchema, createCategorySchema, updateCategorySchema };
