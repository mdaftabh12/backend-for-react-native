import express from "express";
import cors from "cors";

import noteRoutes from "./routes/note.routes";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/notes", noteRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API is working" });
});

export default app;
