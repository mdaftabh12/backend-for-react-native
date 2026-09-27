import { z } from "zod";

// --------------------------------
// Register schema
// --------------------------------
const registerSchema = z
  .object({
    body: z.object({
      name: z
        .string({
          message: "Name is required",
        })
        .trim()
        .min(2, "Name must be at least 2 characters"),

      email: z
        .string({
          message: "Email is required",
        })
        .trim()
        .min(1, "Email is required")
        .email("Invalid email address")
        .toLowerCase(),

      password: z
        .string({
          message: "Password is required",
        })
        .min(6, "Password must be at least 6 characters"),

      confirmPassword: z
        .string({
          message: "Confirm password is required",
        })
        .min(6, "Confirm password must be at least 6 characters"),
    }),

    params: z.object({}),

    query: z.object({}),
  })
  .refine((data) => data.body.password === data.body.confirmPassword, {
    message: "Passwords do not match",
    path: ["body", "confirmPassword"],
  });

// --------------------------------
// Login schema
// --------------------------------
const loginSchema = z.object({
  body: z.object({
    email: z
      .string({
        message: "Email is required",
      })
      .trim()
      .min(1, "Email is required")
      .email("Invalid email address")
      .toLowerCase(),

    password: z
      .string({
        message: "Password is required",
      })
      .min(6, "Password must be at least 6 characters"),
  }),

  params: z.object({}),
  query: z.object({}),
});

// --------------------------------
// Refresh Token Schema
// --------------------------------
const refreshTokenSchema = z.object({
  body: z.object({}),
  params: z.object({}),
  query: z.object({}),
});

// --------------------------------
// Logout schema
// --------------------------------

const logoutSchema = z.object({
  body: z.object({}),
  params: z.object({}),
  query: z.object({}),
});

export { registerSchema, loginSchema, refreshTokenSchema, logoutSchema };
