"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const roomTypeSchema = new mongoose_1.default.Schema({
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
}, { timestamps: true, strict: true });
exports.default = mongoose_1.default.model("Room-type", roomTypeSchema);
//# sourceMappingURL=roomType.js.map