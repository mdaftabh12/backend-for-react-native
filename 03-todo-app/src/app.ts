import express from "express";
import cors from "cors";

import todoRouter from "./routes/todo.routes";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/todos", todoRouter);

app.get("/", (req, res) => {
  res.json({
    message: "API is working",
  });
});

export default app;
