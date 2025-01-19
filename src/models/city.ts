import mongoose from "mongoose";
import { ICity } from "../interfaces/city.interface";

const citySchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  regionId: {
    type: String,
  },
  countryId: {
    type: String,
  },
  code: {
    type: String,
  },
});

export default mongoose.model<ICity>("City", citySchema);
