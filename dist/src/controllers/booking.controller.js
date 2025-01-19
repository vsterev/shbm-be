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
exports.BookingController = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
const tsoa_1 = require("tsoa");
const booking_1 = __importDefault(require("../models/booking"));
const hotelService_Api_service_1 = __importDefault(require("../services/hotelService.Api.service"));
const email_service_1 = __importDefault(require("../services/email.service"));
let BookingController = class BookingController extends tsoa_1.Controller {
    async getAllBooking(body) {
        const { dateFrom, dateTo, booking, isByDate } = body;
        const searchStr = () => {
            let obj = {};
            if (booking) {
                obj = { ...obj, bookingName: booking };
            }
            if (dateFrom && isByDate === "no") {
                obj = { ...obj, ["hotelService.checkIn"]: { $gte: dateFrom } };
            }
            else if (dateFrom && isByDate === "yes") {
                obj = { ...obj, dateInputed: { $gte: dateFrom } };
            }
            if (dateTo && isByDate === "no") {
                obj["hotelService.checkIn"] = {
                    ...obj["hotelService.checkIn"],
                    $lte: dateTo,
                };
            }
            else if (dateTo && isByDate === "yes") {
                obj.dateInputed = { ...obj.dateInputed, $lte: dateTo };
            }
            // if (!booking||!dateFrom||!dateTo) {
            //     console.log('please fill in the fields')
            //     // throw new Error('please fill in the fields')
            //     res.status(530).json('please fill in the fields')
            // }
            return obj;
        };
        const limit = Number(body.limit) || 100;
        const skip = Number(body.skip) || 0;
        return booking_1.default
            .find(searchStr())
            .sort({ dateInputed: -1 })
            .limit(limit)
            .skip(skip);
    }
    async getLength(body) {
        const { dateFrom, dateTo, booking, isByDate } = body;
        const searchStr = () => {
            let obj = {};
            if (booking) {
                obj = { ...obj, bookingName: booking };
            }
            if (dateFrom && isByDate === "no") {
                obj = { ...obj, ["hotelService.checkIn"]: { $gte: dateFrom } };
            }
            else if (dateFrom && isByDate === "yes") {
                obj = { ...obj, dateInputed: { $gte: dateFrom } };
            }
            if (dateTo && isByDate === "no") {
                obj["hotelService.checkIn"] = {
                    ...obj["hotelService.checkIn"],
                    $lte: dateTo,
                };
            }
            else if (dateTo && isByDate === "yes") {
                obj.dateInputed = { ...obj.dateInputed, $lte: dateTo };
            }
            return obj;
        };
        return booking_1.default.countDocuments(searchStr());
    }
    async confirmBooking(body, notFoundRes) {
        let booking = {};
        if (!body.booking.includes("-")) {
            booking = await booking_1.default
                .findOne({ bookingName: body.booking })
                .sort({ dateInputed: -1 })
                .lean();
        }
        else {
            const searchStr = body.booking.split("-")[1];
            booking = await booking_1.default
                .findOne({ "hotelService.serviceId": searchStr })
                .sort({ dateInputed: -1 })
                .lean();
        }
        if (!booking || !booking.hotelService) {
            throw notFoundRes(404, {
                error: "Hotel service information is missing in the booking.",
            });
        }
        const { serviceId, hotel } = booking.hotelService;
        const { _id, ...newBooking } = booking;
        newBooking.dateInputed = new Date();
        newBooking.parser = {
            send: {},
            response: {},
            manual: { confirm: body },
        };
        if (newBooking.hotelService) {
            newBooking.hotelService.status = "Confirmed";
        }
        await booking_1.default.create(newBooking);
        await hotelService_Api_service_1.default.manageBooking(serviceId, "confirm", body.confirmationNumber, body.message);
        await email_service_1.default.sendEmail({
            type: "confirmation",
            booking: newBooking.bookingName,
            hotel,
        });
        return "booking confirmation was received";
    }
    async denyBooking(body, notFoundRes) {
        let booking = {};
        if (!body.booking.includes("-")) {
            booking = await booking_1.default
                .findOne({ bookingName: body.booking })
                .sort({ dateInputed: -1 })
                .lean();
        }
        else {
            const searchStr = body.booking.split("-")[1];
            booking = await booking_1.default
                .findOne({ "hotelService.serviceId": searchStr })
                .sort({ dateInputed: -1 })
                .lean();
        }
        if (!booking || !booking.hotelService) {
            throw notFoundRes(404, {
                error: "Hotel service information is missing in the booking.",
            });
        }
        const { serviceId, hotel, status } = booking.hotelService;
        const { _id, ...newBooking } = booking;
        newBooking.dateInputed = new Date();
        newBooking.parser = {
            send: {},
            response: {},
            manual: { deny: body },
        };
        let returnStr = "";
        if (status === "Wait" && newBooking.hotelService) {
            newBooking.hotelService.status = "notConfirmed";
            await hotelService_Api_service_1.default.manageBooking(serviceId, "notConfirmed", "OTKAZ!", body.message);
            await email_service_1.default.sendEmail({
                type: "notConfirmed",
                booking: newBooking.bookingName,
                hotel,
            });
            returnStr = "booking Not confirmed status was received";
        }
        else {
            booking.hotelService.status = "Wait";
            await hotelService_Api_service_1.default.manageBooking(serviceId, "wait", "OTKAZ!", body.message);
            await email_service_1.default.sendEmail({
                type: "denied",
                booking: newBooking.bookingName,
                hotel,
            });
            returnStr = "booking denied status was received";
        }
        await booking_1.default.create(newBooking);
        return returnStr;
    }
};
exports.BookingController = BookingController;
__decorate([
    (0, tsoa_1.Post)("find"),
    (0, tsoa_1.Security)("jwt-passport"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "getAllBooking", null);
__decorate([
    (0, tsoa_1.Post)("length"),
    (0, tsoa_1.Security)("jwt-passport"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "getLength", null);
__decorate([
    (0, tsoa_1.Post)("confirm"),
    __param(0, (0, tsoa_1.Body)()),
    __param(1, (0, tsoa_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Function]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "confirmBooking", null);
__decorate([
    (0, tsoa_1.Post)("deny"),
    __param(0, (0, tsoa_1.Body)()),
    __param(1, (0, tsoa_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Function]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "denyBooking", null);
exports.BookingController = BookingController = __decorate([
    (0, tsoa_1.Route)("bookings"),
    (0, tsoa_1.Tags)("bookings")
], BookingController);
//# sourceMappingURL=booking.controller.js.map