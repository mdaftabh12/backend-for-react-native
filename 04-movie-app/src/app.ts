import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import env from "./config/env";
import { errorMiddleware } from "./middleware/error.middleware";
import { authRouter } from "./routes/auth.routes";
import { userRouter } from "./routes/user.routes";
import { categoryRouter } from "./routes/category.routes";
import { movieRouter } from "./routes/movie.routes";
import { favoriteRouter } from "./routes/favorite.routes";
import { watchlistRouter } from "./routes/watchlist.routes";
import { reviewRouter } from "./routes/review.routes";


const app = express();

app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true,
  }),
);
app.use(express.json({ limit: "20kb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "20kb",
  }),
);
app.use(express.static("public"));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API is working",
  });
});

// API routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/movies", movieRouter);
app.use("/api/v1/favorites", favoriteRouter);
app.use("/api/v1/watchlist", watchlistRouter);
app.use("/api/v1/reviews", reviewRouter);

// Error middleware must be registered after all routes.
app.use(errorMiddleware);

export default app;
