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
exports.ParserController = void 0;
const tsoa_1 = require("tsoa");
const parsing_Api_service_1 = __importDefault(require("../services/parsing.Api.service"));
const hotel_1 = __importDefault(require("../models/hotel"));
const logger_1 = __importDefault(require("../utils/logger"));
const parserReport_1 = __importDefault(require("../models/parserReport"));
let ParserController = class ParserController extends tsoa_1.Controller {
    async hotelCompare() {
        try {
            const parserHotels = await parsing_Api_service_1.default.getHotels();
            const interlookHotels = (await hotel_1.default.find())
                .filter((hotel) => hotel.parserCode)
                .map((hotel) => hotel.parserCode);
            const mappedParserHotels = parserHotels?.map((hotel) => {
                if (interlookHotels.includes(hotel.HotelID)) {
                    return { ...hotel, mapped: true };
                }
                return { ...hotel, mapped: false };
            }) || [];
            return { parserHotels: mappedParserHotels, interlookHotels };
        }
        catch (error) {
            logger_1.default.error(error);
        }
    }
    async getHotelProps(body) {
        const parsingBoards = await parsing_Api_service_1.default.getBoards(body.parserCode);
        const parsingRooms = await parsing_Api_service_1.default.getRooms(body.parserCode);
        return { boards: parsingBoards, rooms: parsingRooms };
    }
    async getReports(body) {
        const limit = body.limit || 100;
        const skip = body.skip || 0;
        return parserReport_1.default
            .find()
            .sort({ dateInputed: -1 })
            .limit(limit)
            .skip(skip);
    }
};
exports.ParserController = ParserController;
__decorate([
    (0, tsoa_1.Get)("hotels-compare"),
    (0, tsoa_1.Security)("jwt-passport"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ParserController.prototype, "hotelCompare", null);
__decorate([
    (0, tsoa_1.Post)("hotel-props"),
    (0, tsoa_1.Security)("jwt-passport"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ParserController.prototype, "getHotelProps", null);
__decorate([
    (0, tsoa_1.Post)("reports"),
    (0, tsoa_1.Security)("jwt-passport"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ParserController.prototype, "getReports", null);
exports.ParserController = ParserController = __decorate([
    (0, tsoa_1.Route)("parser"),
    (0, tsoa_1.Tags)("parser")
], ParserController);
//# sourceMappingURL=parser.controller.js.map