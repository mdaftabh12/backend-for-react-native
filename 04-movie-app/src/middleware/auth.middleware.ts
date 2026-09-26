import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

import env from "../config/env";
import { ApiError } from "../utils/api-error";

interface AccessTokenPayload {
  userId: string;
}

const authMiddleware: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError(401, "Access token is required"));
  }

  const accessToken = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      accessToken,
      env.jwt.accessTokenSecret,
    ) as AccessTokenPayload;

    req.user = {
      userId: decoded.userId,
    };

    next();
  } catch (error) {
    return next(new ApiError(401, "Invalid or expired access token"));
  }
};

export { authMiddleware };
