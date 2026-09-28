import { Router } from "express";

import {
  addReview,
  getMovieReviews,
  getMyReviews,
  updateReview,
  deleteReview,
} from "../controllers/review.controller";

import { authMiddleware } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";

import {
  createReviewSchema,
  updateReviewSchema,
  reviewIdSchema,
  movieReviewsSchema,
} from "../validations/review.validation";

const router = Router();

// Public: Get reviews for a movie
router.get("/movie/:movieId", validate(movieReviewsSchema), getMovieReviews);

// All routes below require authentication
router.use(authMiddleware);

// Get my reviews
router.get("/my-reviews", getMyReviews);

// Add review
router.post("/movie/:movieId", validate(createReviewSchema), addReview);

// Update my review
router.patch("/:reviewId", validate(updateReviewSchema), updateReview);

// Delete my review
router.delete("/:reviewId", validate(reviewIdSchema), deleteReview);

export { router as reviewRouter };
