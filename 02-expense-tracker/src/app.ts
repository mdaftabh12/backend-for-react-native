import express from "express";
import cors from "cors";

import authRouter from "./routes/auth.routes";
import categoryRouter from "./routes/category.routes";


const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRouter);
app.use("/api/categories", categoryRouter);

app.get("/", (req, res) => {
  res.json({ message: "API is working" });
});

export default app;
