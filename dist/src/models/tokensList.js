"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const tokenslistSchema = new mongoose_1.default.Schema({
    token: { type: String, required: true },
    ip: { type: String },
    date: { type: Date },
});
exports.default = mongoose_1.default.model("Tokenslist", tokenslistSchema);
//# sourceMappingURL=tokensList.js.map