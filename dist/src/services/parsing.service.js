"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hotelMap_1 = __importDefault(require("../models/hotelMap"));
const email_service_1 = __importDefault(require("./email.service"));
const parsing_Api_service_1 = __importDefault(require("./parsing.Api.service"));
const booking_1 = __importDefault(require("../models/booking"));
const hotelService_Api_service_1 = __importDefault(require("./hotelService.Api.service"));
class ParsingService {
    static async bookingPrepare(bookings) {
        const result = {
            errors: 0,
            sended: 0,
            confirmed: 0,
            notConfirmed: 0,
            cancelled: 0,
        };
        for (const booking of bookings) {
            for (const hts of booking.hotelServices) {
                const bookingInDatabase = await booking_1.default
                    .findOne({ "hotelService.serviceId": hts.serviceId })
                    .sort({ dateInputed: -1 });
                const hasVoucher = bookingInDatabase?.parser?.response?.Vocher;
                if (booking.action === "Changed" &&
                    hts.serviceName.match(/.*penalty.*/gim)) {
                    booking.action = "Cancel";
                }
                else if (booking.action === "Changed" && !hasVoucher) {
                    booking.action = "New";
                }
                const mapTable = await hotelMap_1.default.findOne({ _id: hts.hotelId });
                if (!mapTable ||
                    !mapTable.parserHotelServer ||
                    !mapTable.rooms[hts.roomMapCode]?.parserCode ||
                    !mapTable.boards[hts.pansionId]?.parserCode) {
                    await email_service_1.default.sendEmail({
                        type: "error",
                        booking: booking.bookingName,
                        hotel: hts.hotel,
                    });
                    result.errors++;
                    continue;
                }
                const serializeParserBookingRequest = parsing_Api_service_1.default.bookingSerialization(booking, hts, mapTable);
                const parsingResponsePromise = await parsing_Api_service_1.default.createReservation(serializeParserBookingRequest);
                const parsingResponse = parsingResponsePromise;
                const parserBbookingPrice = `${parsingResponse?.PriceAmount} ${parsingResponse?.PriceCurrency}`;
                const parserMessage = parsingResponse?.ResponseText;
                const msgConfirmation = `parser -> price: ${parserBbookingPrice} | txt: ${parserMessage}`;
                const log = booking;
                if (parsingResponse?.ConfirmationNo !== "" &&
                    parsingResponse?.ConfirmationNo !== "0" &&
                    booking.action !== "Cancel") {
                    if (log.hotelService) {
                        log.hotelService.status = "Confirmed";
                    }
                    await email_service_1.default.sendEmail({
                        type: "confirmation",
                        booking: booking.bookingName,
                        hotel: hts.hotel,
                    });
                    await hotelService_Api_service_1.default.manageBooking(hts.serviceId, "confirm", parsingResponse?.ConfirmationNo || "", msgConfirmation);
                    result.confirmed++;
                }
                else {
                    if (log.hotelService) {
                        log.hotelService.status = "Cancel";
                    }
                    await email_service_1.default.sendEmail({
                        type: "notConfirmed",
                        booking: booking.bookingName,
                        hotel: hts.hotel,
                    });
                    await hotelService_Api_service_1.default.manageBooking(hts.serviceId, "notConfirmed", parsingResponse?.ConfirmationNo || "", msgConfirmation);
                    result.notConfirmed++;
                }
                await booking_1.default.create(log);
            }
        }
        return result;
    }
}
exports.default = ParsingService;
//# sourceMappingURL=parsing.service.js.map