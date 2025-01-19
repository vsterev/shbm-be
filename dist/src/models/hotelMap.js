"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const city_1 = __importDefault(require("./city"));
const BoardSchema = new mongoose_1.default.Schema({
    boardId: { type: Number, required: true },
    boardName: { type: String, required: true },
    parserCode: { type: String },
});
const RoomSchema = new mongoose_1.default.Schema({
    roomTypeId: { type: Number },
    roomTypeName: { type: String },
    roomCategoryId: { type: Number },
    roomCategoryName: { type: String },
    parserCode: { type: String },
});
const hotelMapSchema = new mongoose_1.default.Schema({
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
        ref: city_1.default,
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
    parserCode: {
        type: Number,
    },
    parserName: {
        type: String,
    },
    parserHotelServer: {
        type: String,
    },
}, { timestamps: true, strict: true });
exports.default = mongoose_1.default.model("Map-hotel", hotelMapSchema);
//# sourceMappingURL=hotelMap.js.map