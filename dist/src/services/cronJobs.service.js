"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const interlook_Api_service_1 = __importDefault(require("./interlook.Api.service"));
const hotel_1 = __importDefault(require("../models/hotel"));
const logger_1 = __importDefault(require("../utils/logger"));
const mongoose_1 = __importDefault(require("mongoose"));
class CronJobsService {
    static async getHotels() {
        const session = await mongoose.startSession();
        try {
            const hotels = await interlook_Api_service_1.default.getHotels();
            for (const hotel of hotels) {
                console.log(hotel);
                await hotel_1.default.findOneAndUpdate({ _id: hotel._id }, { $set: hotel }, {
                    upsert: true,
                    session 
                });
            }
            await session.commitTransaction();
            return logger_1.default.info(`${hotels.length} hotels are synchronized with Interlook`);
        }
        catch (error) {
            await session.abortTransaction();
            logger_1.default.error(error);
        }
        finally {
            session.endSession();
        }
    }
    static async getBoards() {
        const session = await mongoose_1.default.startSession();
        try {
            const boards = await interlook_Api_service_1.default.getBoards();
            for (const board of boards) {
                await hotel_1.default.findOneAndUpdate({ _id: board._id }, { $set: board }, { upsert: true, session });
            }
            await session.commitTransaction();
            return logger_1.default.info(`${boards.length} boards are synchronized with Interlook`);
        }
        catch (error) {
            await session.abortTransaction();
            logger_1.default.error(error);
        }
        finally {
            session.endSession();
        }
    }
}
exports.default = CronJobsService;
//# sourceMappingURL=cronJobs.service.js.map