import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

import { ApiError } from "../utils/api-error";

const errorMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  console.error(err);

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.issues,
      data: null,
    });

    return;
  }

  // Handle custom application errors
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
      errors: err.errors,
      data: err.data,
    });

    return;
  }

  // Handle unknown/unexpected errors
  res.status(500).json({
    success: false,
    message: "Internal server error",
    errors: [],
    data: null,
  });
};

export { errorMiddleware };
