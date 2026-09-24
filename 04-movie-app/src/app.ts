import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import env from "./config/env";
import authRoutes from "./routes/auth.routes";
import { errorMiddleware } from "./middleware/error.middleware";

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
app.use("/api/v1/auth", authRoutes);

// Error middleware must be registered after all routes.
app.use(errorMiddleware);

export default app;
