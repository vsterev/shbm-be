import mongoose from "mongoose";
import { IRoomCategory } from "../interfaces/roomCategory.interface";
const roomCategorySchema = new mongoose.Schema(
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
    mainPlaces: {
      type: Number,
    },
    extraPlaces: {
      type: Number,
    },
  },
  { timestamps: true, strict: true },
);
export default mongoose.model<IRoomCategory>(
  "Room-category",
  roomCategorySchema,
);
