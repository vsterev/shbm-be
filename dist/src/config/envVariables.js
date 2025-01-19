"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const fs = __importStar(require("fs"));
if (!fs.existsSync(".env")) {
    console.error(".env not found!");
    process.exit(1);
}
dotenv.config();
if (!process.env.PARSER_URL ||
    !process.env.PARSER_USER ||
    !process.env.PARSER_PASSWORD ||
    !process.env.HOTEL_SERVICE_URL ||
    !process.env.HOTEL_SERVICE_USER ||
    !process.env.HOTEL_SERVICE_PASSWORD ||
    !process.env.INTERLOOK_URL ||
    !process.env.INTERLOOK_USER ||
    !process.env.INTERLOOK_PASSWORD ||
    !process.env.API_TOKEN_SECRET) {
    console.error(".env not fully set up!");
    process.exit(1);
}
exports.default = {
    NODE_ENV: process.env.NODE_ENV || "DEV",
    APP_PORT: Number(process.env.APP_PORT) || 3000,
    MONGO_URL: process.env.MONGO_URL,
    DEBUG_MODE: process.env.DEBUG_MODE || "false",
    REDIS_HOST: process.env.REDIS_HOST || "localhost",
    REDIS_PORT: Number(process.env.REDIS_PORT) || 6379,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    REDIS_DB: Number(process.env.REDIS_DB) || 0,
    PARSER_URL: process.env.PARSER_URL,
    PARSER_USER: process.env.PARSER_USER,
    PARSER_PASSWORD: process.env.PARSER_PASSWORD,
    HOTEL_SERVICE_URL: process.env.HOTEL_SERVICE_URL,
    HOTEL_SERVICE_USER: process.env.HOTEL_SERVICE_USER,
    HOTEL_SERVICE_PASSWORD: process.env.HOTEL_SERVICE_PASSWORD,
    MAIL_USER: process.env.MAIL_ADDRES,
    MAIL_PASS: process.env.MAIL_PASS,
    MAIL_HOST: process.env.MAIL_HOST,
    MAIL_PORT: process.env.MAIL_PORT,
    MAIL_RECIEPENTS: process.env.MAIL_RECIEPENTS,
    INTERLOOK_URL: process.env.INTERLOOK_URL,
    INTERLOOK_USER: process.env.INTERLOOK_USER,
    INTERLOOK_PASSWORD: process.env.INTERLOOK_PASSWORD,
    API_TOKEN_SECRET: process.env.API_TOKEN_SECRET,
};
//# sourceMappingURL=envVariables.js.map