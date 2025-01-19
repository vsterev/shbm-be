import mongoose from "mongoose";
import { IToken } from "../interfaces/token.interface";

const tokenslistSchema = new mongoose.Schema({
  token: { type: String, required: true },
  ip: { type: String },
  date: { type: Date },
});
export default mongoose.model<IToken>("Tokenslist", tokenslistSchema);
