import { Router } from "express";
import {
  createNote,
  deleteNote,
  getAllNotes,
  getNoteById,
  updateNote,
  toggleNoteStar,
  toggleNoteDisabled,
  getAllStarNotes,
  getAllDisabledNotes,
  searchNotes,
} from "../controllers/note.controller";

const router = Router();

router.post("/create-note", createNote);
router.get("/get-all-notes", getAllNotes);
router.get("/get-note/:noteId", getNoteById);
router.put("/update-note/:noteId", updateNote);
router.delete("/delete-note/:noteId", deleteNote);
router.put("/toggle-star/:noteId", toggleNoteStar);
router.put("/toggle-disabled/:noteId", toggleNoteDisabled);
router.get("/get-all-star-notes", getAllStarNotes);
router.get("/get-all-disabled-notes", getAllDisabledNotes);
router.get("/search-notes", searchNotes);

export default router;
