import mongoose from "mongoose";
import { IToken } from "../interfaces/token.interface";
type ITokenBlacklist = Omit<IToken, "date" | "ip">;
const tokenBlacklistSchema = new mongoose.Schema(
  {
    token: { type: String, required: true },
  },
  { strict: true, timestamps: true },
);

module.exports = mongoose.model<ITokenBlacklist>(
  "Token-blacklist",
  tokenBlacklistSchema,
);
