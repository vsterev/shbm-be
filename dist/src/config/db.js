"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const envVariables_1 = __importDefault(require("./envVariables"));
const dbConnect = () => {
    if (!envVariables_1.default.MONGO_URL) {
        throw new Error("MONGO_URL is not defined in the environment configuration");
    }
    return mongoose_1.default.connect(envVariables_1.default.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    });
};
exports.default = dbConnect;
//# sourceMappingURL=db.js.map