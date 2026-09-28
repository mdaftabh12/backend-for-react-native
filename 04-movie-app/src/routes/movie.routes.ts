import { Router } from "express";
import {
  createMovie,
  getAllMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
  getMoviesByCategory,
} from "../controllers/movie.controller";
import { authMiddleware, authorizeRoles } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { upload } from "../middleware/multer.middleware";
import {
  createMovieSchema,
  updateMovieSchema,
  movieIdSchema,
  getMoviesSchema,
  moviesByCategorySchema,
} from "../validations/movie.validation";

const router = Router();

const movieUpload = upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "video", maxCount: 5 },
]);

// --------------------------------
// Public Routes
// --------------------------------

router.get("/", validate(getMoviesSchema), getAllMovies);

router.get(
  "/category/:categoryId",
  validate(moviesByCategorySchema),
  getMoviesByCategory,
);

router.get("/:id", validate(movieIdSchema), getMovieById);

// --------------------------------
// Admin Routes
// --------------------------------
router.post(
  "/create-movie",
  authMiddleware,
  authorizeRoles("ADMIN"),
  movieUpload,
  validate(createMovieSchema),
  createMovie,
);

router.put(
  "update-movie/:id",
  authMiddleware,
  authorizeRoles("ADMIN"),
  movieUpload,
  validate(updateMovieSchema),
  updateMovie,
);

router.delete(
  "delete-movie/:id",
  authMiddleware,
  authorizeRoles("ADMIN"),
  validate(movieIdSchema),
  deleteMovie,
);

export { router as movieRouter };
