import { z } from "zod";

const registerSchema = z
  .object({
    body: z.object({
      name: z.string().trim().min(2, "Name must be at least 2 characters"),

      email: z.string().trim().email("Invalid email address").toLowerCase(),

      password: z.string().min(6, "Password must be at least 6 characters"),

      confirmPassword: z
        .string()
        .min(6, "Confirm password must be at least 6 characters"),
    }),

    params: z.object({}),
    query: z.object({}),
  })
  .refine((data) => data.body.password === data.body.confirmPassword, {
    message: "Passwords do not match",
    path: ["body", "confirmPassword"],
  });

const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email("Invalid email address").toLowerCase(),

    password: z.string().min(6, "Password must be at least 6 characters"),
  }),

  params: z.object({}),
  query: z.object({}),
});

export { registerSchema, loginSchema };
