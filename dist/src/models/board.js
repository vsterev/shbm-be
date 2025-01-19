"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const boardSchema = new mongoose_1.default.Schema({
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
}, { timestamps: true, strict: true });
exports.default = mongoose_1.default.model("Board", boardSchema);
//# sourceMappingURL=board.js.map