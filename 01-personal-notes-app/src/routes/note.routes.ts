import { Router } from "express";
import { createNote, getAllNotes } from "../controllers/note.controller";

const router = Router();

router.post("/create-note", createNote);
router.get("/get-notes", getAllNotes);

export default router;
