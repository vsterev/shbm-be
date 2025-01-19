"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterlookController = void 0;
const tsoa_1 = require("tsoa");
const city_1 = __importDefault(require("../models/city"));
const hotel_1 = __importDefault(require("../models/hotel"));
const interlook_Api_service_1 = __importDefault(require("../services/interlook.Api.service"));
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("../utils/logger"));
const hotelService_Api_service_1 = __importDefault(require("../services/hotelService.Api.service"));
const hotelService_service_1 = __importDefault(require("../services/hotelService.service"));
const parsing_service_1 = __importDefault(require("../services/parsing.service"));
let InterlookController = class InterlookController extends tsoa_1.Controller {
    async getCities() {
        const session = await mongoose_1.default.startSession();
        try {
            const interlookCities = await interlook_Api_service_1.default.getCities();
            await city_1.default.collection.drop({ session });
            const inserted = await city_1.default.insertMany(interlookCities, {
                session,
                ordered: false,
            });
            await session.commitTransaction();
            logger_1.default.info(`${inserted.length} cities are synchronized with Interlook`);
            return inserted;
        }
        catch (error) {
            logger_1.default.error(error);
            await session.abortTransaction();
        }
        finally {
            session.endSession();
        }
    }
    async getHotels() {
        // const session = await mongoose.startSession();
        try {
            const intertlookHotels = await interlook_Api_service_1.default.getHotels();
            await hotel_1.default.collection.drop(
            // { session }
            );
            const inserted = await hotel_1.default.insertMany(intertlookHotels);
            // await session.commitTransaction();
            logger_1.default.info(`${inserted.length} hotels are synchronized with Interlook`);
            return inserted;
        }
        catch (error) {
            logger_1.default.error(error);
            // await session.abortTransaction();
        }
        finally {
            // session.endSession();
        }
    }
    async getBookings(body) {
        try {
            const newBookings = await hotelService_Api_service_1.default.getNewBookings(body.action);
            const bookings = hotelService_service_1.default.deserializeXMLBooking(newBookings || [], body.action);
            return bookings;
        }
        catch (error) {
            logger_1.default.error(error);
        }
    }
    async sendBookings(body) {
        try {
            return parsing_service_1.default.bookingPrepare(body.bookings);
        }
        catch (error) {
            logger_1.default.error(error);
        }
    }
};
exports.InterlookController = InterlookController;
__decorate([
    (0, tsoa_1.Get)("get-cities"),
    (0, tsoa_1.Security)("jwt-passport"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InterlookController.prototype, "getCities", null);
__decorate([
    (0, tsoa_1.Get)("get-hotels"),
    (0, tsoa_1.Security)("jwt-passport"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InterlookController.prototype, "getHotels", null);
__decorate([
    (0, tsoa_1.Post)("get-bookings"),
    (0, tsoa_1.Security)("jwt-passport"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InterlookController.prototype, "getBookings", null);
__decorate([
    (0, tsoa_1.Post)("send-bookings"),
    (0, tsoa_1.Security)("jwt-passport"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InterlookController.prototype, "sendBookings", null);
exports.InterlookController = InterlookController = __decorate([
    (0, tsoa_1.Route)("il"),
    (0, tsoa_1.Tags)("interlook")
], InterlookController);
//# sourceMappingURL=interlook.controller.js.map