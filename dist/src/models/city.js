"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const citySchema = new mongoose_1.default.Schema({
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
exports.default = mongoose_1.default.model("City", citySchema);
//# sourceMappingURL=city.js.map