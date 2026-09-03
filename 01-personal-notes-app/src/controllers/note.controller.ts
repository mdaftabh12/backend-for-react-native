import { Request, Response } from "express";
import Note from "../models/note.model";

// ====================
// Request Types
// ====================
export interface CreateNoteRequest {
  title: string;
  description: string;
}

export interface UpdateNoteRequest {
  title?: string;
  description?: string;
}

// ====================
// Create Note
// ====================
const createNote = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body as CreateNoteRequest;

    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter a title for your note.",
      });
    }

    if (!description?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please write something in your note.",
      });
    }

    const note = await Note.create({
      title: title.trim(),
      description: description.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Your note was created successfully. 📝",
      data: note,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ====================
// Get All Notes
// ====================
const getAllNotes = async (req: Request, res: Response) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });

    if (!notes.length) {
      return res.status(404).json({
        success: false,
        message: "You don't have any notes yet. Create your first note! 📝",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Here are all your notes. 📚",
      data: notes,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ====================
// Get Note By ID
// ====================
const getNoteById = async (req: Request, res: Response) => {
  try {
    const { noteId } = req.params;
    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({
        success: false,
        message: "We couldn't find that note. It may have been deleted. 😕",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Your note is ready to view. 👀",
      data: note,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ====================
// Update Note
// ====================
const updateNote = async (req: Request, res: Response) => {
  try {
    const { noteId } = req.params;
    const { title, description } = req.body as UpdateNoteRequest;

    if (!title?.trim() && !description?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one field to update.",
      });
    }

    const updateData: UpdateNoteRequest = {};

    if (title?.trim()) {
      updateData.title = title.trim();
    }

    if (description?.trim()) {
      updateData.description = description.trim();
    }

    const updatedNote = await Note.findByIdAndUpdate(noteId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedNote) {
      return res.status(404).json({
        success: false,
        message: "We couldn't find that note. It may have been deleted. 😕",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Your note was updated successfully. ✨",
      data: updatedNote,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ====================
// Delete Note
// ====================
const deleteNote = async (req: Request, res: Response) => {
  try {
    const { noteId } = req.params;

    const deletedNote = await Note.findByIdAndDelete(noteId);

    if (!deletedNote) {
      return res.status(404).json({
        success: false,
        message:
          "We couldn't find that note. It may have already been deleted. 😕",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Your note was deleted successfully. 🗑️",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ====================
// Toggle Note Star
// ====================
const toggleNoteStar = async (req: Request, res: Response) => {
  try {
    const { noteId } = req.params;
    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "We couldn't find that note. 😕",
      });
    }

    const updatedNote = await Note.findByIdAndUpdate(
      { _id: note._id },
      { isStar: !note.isStar },
      { new: true },
    );

    const message = updatedNote?.isStar
      ? "Note added to your starred list. ⭐"
      : "Note removed from your starred list.";

    return res.status(200).json({ success: true, message: message });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ====================
// Toggle Note Disabled
// ====================
const toggleNoteDisabled = async (req: Request, res: Response) => {
  try {
    const { noteId } = req.params;
    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "We couldn't find that note. 😕",
      });
    }

    const updatedNote = await Note.findByIdAndUpdate(
      { _id: note._id },
      { isDisabled: !note.isDisabled },
      { new: true },
    );

    const message = updatedNote?.isDisabled
      ? "Note moved to disabled notes. 📦"
      : "Note restored successfully. ✨";

    return res.status(200).json({ success: true, message: message });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================
// Get All Starred Notes
// ======================
const getAllStarNotes = async (req: Request, res: Response) => {
  try {
    const notes = await Note.find({ isStar: true }).sort({ createdAt: -1 });

    if (!notes.length) {
      return res.status(404).json({
        success: false,
        message: "You don't have any starred notes yet.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Here are your starred notes. ⭐",
      data: notes,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// Get All Disabled Notes
// =======================
const getAllDisabledNotes = async (req: Request, res: Response) => {
  try {
    const notes = await Note.find({ isDisabled: true }).sort({ createdAt: -1 });

    if (!notes.length) {
      return res.status(404).json({
        success: false,
        message: "You don't have any disabled notes.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Here are your disabled notes. 📦",
      data: notes,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ====================
// Search Notes
// ====================
const searchNotes = async (req: Request, res: Response) => {
  try {
    const search = req.query.search as string;

    if (!search?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter something to search for. 🔍",
      });
    }

    const searchText = search.trim();

    // Escape special regex characters
    const escapedSearch = searchText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const notes = await Note.find({
      $or: [
        {
          title: {
            $regex: escapedSearch,
            $options: "i",
          },
        },
        {
          description: {
            $regex: escapedSearch,
            $options: "i",
          },
        },
      ],
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message:
        notes.length > 0
          ? `${notes.length} note${
              notes.length > 1 ? "s" : ""
            } found for "${searchText}". 🔍`
          : `No notes found for "${searchText}".`,
      data: notes,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ====================
// Exports
// ====================
export {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
  toggleNoteStar,
  toggleNoteDisabled,
  getAllStarNotes,
  getAllDisabledNotes,
  searchNotes,
};
