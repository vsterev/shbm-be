"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const envVariables_1 = __importDefault(require("./envVariables"));
const redis = new ioredis_1.default({
    host: envVariables_1.default.REDIS_HOST || "localhost",
    port: envVariables_1.default.REDIS_PORT ?? 6379,
    password: envVariables_1.default.REDIS_PASSWORD || "",
    db: envVariables_1.default.REDIS_DB ?? 5,
});
exports.default = redis;
//# sourceMappingURL=redis.config.js.map