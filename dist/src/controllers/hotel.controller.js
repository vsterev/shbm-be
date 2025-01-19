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
exports.HotelController = void 0;
const tsoa_1 = require("tsoa");
const hotel_1 = __importDefault(require("../models/hotel"));
const hotelMap_1 = __importDefault(require("../models/hotelMap"));
const interlook_Api_service_1 = __importDefault(require("../services/interlook.Api.service"));
const parsing_Api_service_1 = __importDefault(require("../services/parsing.Api.service"));
const logger_1 = __importDefault(require("../utils/logger"));
/* eslint-disable @typescript-eslint/no-explicit-any */
let HotelController = class HotelController extends tsoa_1.Controller {
    async getVariants(body, notFoundRes) {
        if (body.parserCode) {
            const result = await hotelMap_1.default.findOne({
                parserCode: body.parserCode,
            });
            if (!result) {
                return notFoundRes(404, { error: "Hotel map not found" });
            }
            return result;
        }
        if (body.ilCode) {
            const result = await hotelMap_1.default.findOne({ _id: +body.ilCode });
            if (!result) {
                return notFoundRes(404, { error: "Hotel map not found" });
            }
            return result;
        }
    }
    async getAllMapped(req) {
        try {
            return hotelMap_1.default.find({ parserCode: { $exists: true } });
        }
        catch (error) {
            logger_1.default.error(error);
        }
    }
    async createHotelVariant(body, notFoundRes) {
        const hotel = await hotel_1.default.findOne({ _id: Number(body.ilCode) });
        if (!hotel) {
            throw notFoundRes(404, { error: "Hotel map not found" });
        }
        return interlook_Api_service_1.default.getCalculationVariants(hotel, body.checkIn, body.checkOut);
    }
    async findHotelByname(body) {
        const str = new RegExp(body.hotelName, "i");
        return hotel_1.default.find({ name: str });
    }
    async hotelMap(body, notFoundRes) {
        try {
            const parsingHotels = (await parsing_Api_service_1.default.getHotels());
            const parserHotel = parsingHotels?.find((el) => el.HotelID === +body.parserCode);
            if (!parserHotel) {
                throw notFoundRes(404, {
                    error: "Hotel with Id not found in Legacy Hotel Information",
                });
            }
            console.log(parserHotel, body.hotelId);
            const updatedHotel = await hotel_1.default.findOneAndUpdate({ _id: body.hotelId }, {
                parserCode: body.parserCode,
                parserName: body.parserCode ? parserHotel?.Hotel : "",
                parserHotelServer: body.parserCode ? parserHotel?.HotelServer : "",
            }, { new: true });
            return updatedHotel || undefined;
        }
        catch (error) {
            logger_1.default.error(error);
        }
    }
    async hotelMapProperties(body) {
        try {
            const { hotelId, boards, rooms } = body;
            const updateHotelMap = await hotelMap_1.default.findOneAndUpdate({ hotelId }, { boards, rooms }, { new: true });
            return updateHotelMap || undefined;
        }
        catch (error) {
            logger_1.default.error(error);
        }
    }
    async deleteHotelMap(body) {
        try {
            await hotel_1.default.findByIdAndUpdate(body.hotelId, { $unset: { parserCode: "", parserHotelServer: "", parserName: "" } }, { new: true });
            await hotelMap_1.default.findByIdAndDelete(body.hotelId);
        }
        catch (error) {
            logger_1.default.error(error);
        }
    }
};
exports.HotelController = HotelController;
__decorate([
    (0, tsoa_1.Post)("variants"),
    (0, tsoa_1.Security)("jwt-passport"),
    __param(0, (0, tsoa_1.Body)()),
    __param(1, (0, tsoa_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Function]),
    __metadata("design:returntype", Promise)
], HotelController.prototype, "getVariants", null);
__decorate([
    (0, tsoa_1.Get)("all-mapped"),
    (0, tsoa_1.Security)("jwt-passport"),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HotelController.prototype, "getAllMapped", null);
__decorate([
    (0, tsoa_1.Post)("create-variants"),
    (0, tsoa_1.Security)("jwt-passport"),
    __param(0, (0, tsoa_1.Body)()),
    __param(1, (0, tsoa_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Function]),
    __metadata("design:returntype", Promise)
], HotelController.prototype, "createHotelVariant", null);
__decorate([
    (0, tsoa_1.Post)("find"),
    (0, tsoa_1.Security)("jwt-passport"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HotelController.prototype, "findHotelByname", null);
__decorate([
    (0, tsoa_1.Patch)("hotel-map"),
    (0, tsoa_1.Security)("jwt-passport"),
    __param(0, (0, tsoa_1.Body)()),
    __param(1, (0, tsoa_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Function]),
    __metadata("design:returntype", Promise)
], HotelController.prototype, "hotelMap", null);
__decorate([
    (0, tsoa_1.Patch)("hotel-map/properties"),
    (0, tsoa_1.Security)("jwt-passport"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HotelController.prototype, "hotelMapProperties", null);
__decorate([
    (0, tsoa_1.Delete)("hotel-map"),
    (0, tsoa_1.Security)("jwt-passport"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HotelController.prototype, "deleteHotelMap", null);
exports.HotelController = HotelController = __decorate([
    (0, tsoa_1.Route)("hotels"),
    (0, tsoa_1.Tags)("hotels")
], HotelController);
//# sourceMappingURL=hotel.controller.js.map