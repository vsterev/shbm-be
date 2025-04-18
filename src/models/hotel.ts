import mongoose from "mongoose";
import { IHotel } from "../interfaces/hotel.interface";

const hotelSchema = new mongoose.Schema(
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
    resort: {
      type: String,
      required: true,
    },
    resortId: {
      type: Number,
      // ref: 'City', //pravi vryzka kym drugata kolekcia, v neya _id===resrortId
      // foreignField: 'resID',
      // justOne: true,
    },
    code: {
      type: String,
    },
    category: {
      type: String,
    },
    regionId: {
      type: Number,
    },
    parserCode: { type: Number, required: false },
    integrationSettings: {
      apiName: String,
      hotelCode: Number,
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    }
  },
  { timestamps: true, strict: true },
);
export default mongoose.model<IHotel>("Hotel", hotelSchema);
