"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const roomCategorySchema = new mongoose_1.default.Schema({
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
}, { timestamps: true, strict: true });
exports.default = mongoose_1.default.model("Room-category", roomCategorySchema);
//# sourceMappingURL=roomCategory.js.map