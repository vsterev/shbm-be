import mongoose from "mongoose";
import { IRoomType } from "../interfaces/roomType.interface";

const roomTypeSchema = new mongoose.Schema(
  {
    _id: {
      type: Number,
      required: true,
      // unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
    },
    description: {
      type: String,
    },
    places: {
      type: Number,
    },
    explaces: {
      type: Number,
    },
  },
  { timestamps: true, strict: true },
);
export default mongoose.model<IRoomType>("Room-type", roomTypeSchema);
