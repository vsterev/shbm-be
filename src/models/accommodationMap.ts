import mongoose from "mongoose";
import { IAccommodationMap } from "../interfaces/acccommodationMap.interface";
import City from "./city";
const BoardSchema = new mongoose.Schema({
  boardId: { type: Number, required: true },
  boardName: { type: String, required: true },
  parserCode: { type: String },
});

const RoomSchema = new mongoose.Schema({
  roomTypeId: { type: Number },
  roomTypeName: { type: String },
  roomCategoryId: { type: Number },
  roomCategoryName: { type: String },
  parserCode: { type: String },
});

const accommodationMapSchema = new mongoose.Schema(
  {
    _id: {
      type: Number,
      required: true,
      unique: true,
    },
    hotelId: {
      type: Number,
      requred: true,
    },
    hotelName: {
      type: String,
      requred: true,
    },
    hotelCode: {
      type: String,
    },
    cityId: {
      type: Number,
      requred: true,
      ref: City,
    },
    cityName: {
      type: String,
      requred: true,
    },
    boards: {
      type: Map,
      of: BoardSchema,
    },
    rooms: {
      type: Map,
      of: RoomSchema,
    },
    integrationName: String,
    // parserCode: {
    //   type: Number,
    // },
    // parserName: {
    //   type: String,
    // },
    // parserHotelServer: {
    //   type: String,
    // },
  },
  { timestamps: true, strict: true },
);
export default mongoose.model<IAccommodationMap>(
  "Map-accommodation",
  accommodationMapSchema,
);
