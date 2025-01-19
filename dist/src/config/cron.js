"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const logger_1 = __importDefault(require("../utils/logger"));
const cronJobs_service_1 = __importDefault(require("../services/cronJobs.service"));
const initializeCronJobs = () => {
    node_cron_1.default.schedule("0 0 1 * * *", function () {
        const current = new Date();
        logger_1.default.info(`${current.toString().substring(0, 24)} Cron job - sync Boards`);
        cronJobs_service_1.default.getBoards();
    });
    node_cron_1.default.schedule("0 34 0 * * *", function () {
        const current = new Date();
        logger_1.default.info(`${current.toString().substring(0, 24)} Cron job - sync Hotels`);
        cronJobs_service_1.default.getHotels();
    });
};
exports.default = initializeCronJobs;
//# sourceMappingURL=cron.js.map