import { Router } from "express";
import {
  addFavorite,
  getMyFavorites,
  removeFavorite,
} from "../controllers/favorite.controller";

import { authMiddleware } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { favoriteMovieSchema } from "../validations/favorite.validation";

const router = Router();

// All favorite routes require authentication
router.use(authMiddleware);

// Get My Favorites
router.get("/get-my-favorites", getMyFavorites);

// Add Favorite
router.post(
  "/add-favorite/:movieId",
  validate(favoriteMovieSchema),
  addFavorite,
);

// Remove Favorite
router.delete(
  "/remove-favorite/:movieId",
  validate(favoriteMovieSchema),
  removeFavorite,
);

export { router as favoriteRouter };
