"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const parsingReportSchema = new mongoose_1.default.Schema({
    dateInputed: { type: Date, default: Date.now() },
    parserHotels: [{ type: String }],
    ip: { type: String },
    sendedBookings: [
        {
            Hotel: { type: String, required: true },
            RoomType: { type: String, required: true },
            CheckIn: { type: String, required: true },
            CheckOut: { type: String, required: true },
            Booked: { type: String, required: true },
            Voucher: { type: String, required: true },
            Board: { type: String, required: true },
            Market: { type: String, required: true },
            Remark: { type: String, required: false },
            Status: { type: String, required: true },
            Comments: { type: String, required: false },
            Flight_Arr: { type: String, required: false },
            Flight_Arr_Time: { type: String, required: false },
            Flight_Dep: { type: String, required: false },
            Flight_Dep_Time: { type: String, required: false },
            Names: [
                {
                    name: { type: String, required: true },
                    birthDate: { type: String, required: false },
                },
            ],
        },
    ],
    errorMappings: [Object],
}, { timestamps: true, strict: true });
exports.default = mongoose_1.default.model("Parser-report", parsingReportSchema);
//# sourceMappingURL=parserReport.js.map