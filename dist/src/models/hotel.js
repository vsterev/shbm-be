"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const hotelSchema = new mongoose_1.default.Schema({
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
    parserName: { type: String, required: false },
    parserHotelServer: { type: String, required: false },
}, { timestamps: true, strict: true });
exports.default = mongoose_1.default.model("Hotel", hotelSchema);
//# sourceMappingURL=hotel.js.map