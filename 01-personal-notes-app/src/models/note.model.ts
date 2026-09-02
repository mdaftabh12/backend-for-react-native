import mongoose from "mongoose";

interface INote {
  title: string;
  description: string;
  date: Date;
  isStar: boolean;
}

const noteSchema = new mongoose.Schema<INote>(
  {
    title: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    date: {
      type: Date,
      default: Date.now,
    },

    isStar: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Note = mongoose.model<INote>("Note", noteSchema);

export default Note;