"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const cls_rtracer_1 = __importDefault(require("cls-rtracer"));
const logFormat = winston_1.format.combine(winston_1.format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss",
}), winston_1.format.printf((info) => {
    const traceId = cls_rtracer_1.default.id();
    if (info.level.includes("error")) {
        return traceId
            ? `[${info.timestamp}] ${info.level}: [${traceId}] ${info.message} ${info.stack}`
            : `[${info.timestamp}] ${info.level}: ${info.message} ${info.stack}`;
    }
    return traceId
        ? `[${info.timestamp}] ${info.level}: [${traceId}] ${info.message}`
        : `[${info.timestamp}] ${info.level}: ${info.message}`;
}));
exports.default = (0, winston_1.createLogger)({
    transports: [
        new winston_1.transports.Console({
            level: process.env.DEBUG_MODE?.toLowerCase() === "true" ? "verbose" : "http",
            handleRejections: true,
            handleExceptions: true,
        }),
    ],
    format: logFormat,
});
//# sourceMappingURL=logger.js.map