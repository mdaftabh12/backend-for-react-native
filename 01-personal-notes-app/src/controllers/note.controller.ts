import { Request, Response } from "express";
import Note from "../models/note.model";

export interface CreateNoteRequest {
  title: string;
  description: string;
}

export interface UpdateNoteRequest {
  title?: string;
  description?: string;
}

const createNote = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body as CreateNoteRequest;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    if (!description) {
      return res.status(400).json({
        success: false,
        message: "Description is required",
      });
    }

    const note = await Note.create({
      title,
      description,
    });

    return res.status(201).json({
      success: true,
      message: "Note created successfully",
      data: note,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllNotes = async (req: Request, res: Response) => {
  try {
    const notes = await Note.find();

    if (!notes.length) {
      return res.status(404).json({
        success: false,
        message: "Notes not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notes found successfully",
      data: notes,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { createNote, getAllNotes };
