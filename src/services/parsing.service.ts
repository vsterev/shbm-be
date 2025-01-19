import { IBooking } from "../interfaces/booking.interface";
import hotelMap from "../models/hotelMap";
import EmailService from "./email.service";
import ParsingAPI from "./parsing.Api.service";
import bookingModel from "../models/booking";
import HotelServiceAPI from "./hotelService.Api.service";

export default class ParsingService {
  static async bookingPrepare(bookings: IBooking[]): Promise<{
    errors: number;
    sended: number;
    confirmed: number;
    notConfirmed: number;
    cancelled: number;
  }> {
    const result = {
      errors: 0,
      sended: 0,
      confirmed: 0,
      notConfirmed: 0,
      cancelled: 0,
    };

    for (const booking of bookings) {
      for (const hts of booking.hotelServices) {
        const bookingInDatabase = await bookingModel
          .findOne({ "hotelService.serviceId": hts.serviceId })
          .sort({ dateInputed: -1 });

        const hasVoucher = bookingInDatabase?.parser?.response?.Vocher;

        if (
          booking.action === "Changed" &&
          hts.serviceName.match(/.*penalty.*/gim)
        ) {
          booking.action = "Cancel";
        } else if (booking.action === "Changed" && !hasVoucher) {
          booking.action = "New";
        }

        const mapTable = await hotelMap.findOne({ _id: hts.hotelId });

        if (
          !mapTable ||
          !mapTable.parserHotelServer ||
          !mapTable.rooms[hts.roomMapCode]?.parserCode ||
          !mapTable.boards[hts.pansionId]?.parserCode
        ) {
          await EmailService.sendEmail({
            type: "error",
            booking: booking.bookingName,
            hotel: hts.hotel,
          });
          result.errors++;
          continue;
        }

        const serializeParserBookingRequest = ParsingAPI.bookingSerialization(
          booking,
          hts,
          mapTable,
        );

        const parsingResponsePromise = await ParsingAPI.createReservation(
          serializeParserBookingRequest,
        );

        const parsingResponse = parsingResponsePromise;
        const parserBbookingPrice = `${parsingResponse?.PriceAmount} ${parsingResponse?.PriceCurrency}`;
        const parserMessage = parsingResponse?.ResponseText;
        const msgConfirmation = `parser -> price: ${parserBbookingPrice} | txt: ${parserMessage}`;
        const log = booking;
        if (
          parsingResponse?.ConfirmationNo !== "" &&
          parsingResponse?.ConfirmationNo !== "0" &&
          booking.action !== "Cancel"
        ) {
          if (log.hotelService) {
            log.hotelService.status = "Confirmed";
          }
          await EmailService.sendEmail({
            type: "confirmation",
            booking: booking.bookingName,
            hotel: hts.hotel,
          });

          await HotelServiceAPI.manageBooking(
            hts.serviceId,
            "confirm",
            parsingResponse?.ConfirmationNo || "",
            msgConfirmation,
          );
          result.confirmed++;
        } else {
          if (log.hotelService) {
            log.hotelService.status = "Cancel";
          }
          await EmailService.sendEmail({
            type: "notConfirmed",
            booking: booking.bookingName,
            hotel: hts.hotel,
          });
          await HotelServiceAPI.manageBooking(
            hts.serviceId,
            "notConfirmed",
            parsingResponse?.ConfirmationNo || "",
            msgConfirmation,
          );
          result.notConfirmed++;
        }
        await bookingModel.create(log);
      }
    }
    return result;
  }
}
