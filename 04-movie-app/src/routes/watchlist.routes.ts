import { Router } from "express";
import {
  addToWatchlist,
  getMyWatchlist,
  removeFromWatchlist,
} from "../controllers/watchlist.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { watchlistMovieSchema } from "../validations/watchlist.validation";

const router = Router();

router.use(authMiddleware);

// Get My Watchlist
router.get("/get-my-watchlist", getMyWatchlist);

// Add Movie
router.post(
  "/add-movie/:movieId",
  validate(watchlistMovieSchema),
  addToWatchlist,
);

// Remove Movie
router.delete(
  "/remove-movie/:movieId",
  validate(watchlistMovieSchema),
  removeFromWatchlist,
);

export { router as watchlistRouter };
