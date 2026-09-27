import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

import User from "../models/user.model";
import env from "../config/env";
import { ApiError } from "../utils/api-error";

interface AccessTokenPayload {
  userId: string;
}

const authMiddleware: RequestHandler = async (req, res, next) => {
  try {
    // Get token from cookie
    let accessToken = req.cookies?.accessToken;

    // --------------------------------
    // If cookie doesn't exist,
    // get token from Authorization header
    // --------------------------------
    if (!accessToken) {
      const authHeader = req.headers.authorization;

      if (authHeader && authHeader.startsWith("Bearer ")) {
        accessToken = authHeader.split(" ")[1];
      }
    }

    if (!accessToken) {
      throw new ApiError(401, "Access token is required");
    }

    // Verify token
    const decoded = jwt.verify(
      accessToken,
      env.jwt.accessTokenSecret,
    ) as AccessTokenPayload;

    if (!decoded.userId) {
      throw new ApiError(401, "Invalid access token");
    }

    const user = await User.findById(decoded.userId).select(
      "_id role isDisabled",
    );

    if (!user) {
      throw new ApiError(401, "User not found");
    }

    if (user.isDisabled) {
      throw new ApiError(403, "Your account has been disabled");
    }

    // Attach user to request
    req.user = {
      userId: user._id.toString(),
      role: user.role,
    };

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }

    return next(new ApiError(401, "Invalid or expired access token"));
  }
};

const authorizeRoles = (
  ...allowedRoles: ("USER" | "ADMIN")[]
): RequestHandler => {
  return async (req, res, next) => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        throw new ApiError(401, "Unauthorized");
      }

      const user = await User.findById(userId).select("role");

      if (!user) {
        throw new ApiError(401, "User not found");
      }

      if (!allowedRoles.includes(user.role)) {
        throw new ApiError(
          403,
          "You do not have permission to access this resource",
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export { authMiddleware, authorizeRoles };
