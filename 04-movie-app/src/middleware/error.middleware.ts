import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

import { ApiError } from "../utils/api-error";

const errorMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // Zod validation error
  if (err instanceof ZodError) {
    const firstError = err.issues[0];

    res.status(400).json({
      success: false,
      message: firstError?.message ?? "Validation failed",
      data: null,
    });

    return;
  }

  // Custom ApiError
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
      data: err.data,
    });

    return;
  }

  // Unknown error
  console.error(err);

  res.status(500).json({
    success: false,
    message: "Internal server error",
    data: null,
  });
};

export { errorMiddleware };
