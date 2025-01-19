import mongoose from "mongoose";
import { IBoard } from "../interfaces/board.interface";

const boardSchema = new mongoose.Schema(
  {
    _id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
    },
    code: {
      type: String,
    },
  },
  { timestamps: true, strict: true },
);

export default mongoose.model<IBoard>("Board", boardSchema);
