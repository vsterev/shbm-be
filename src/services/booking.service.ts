import { IBooking, IBookingPrepared, IBookingHotelServicePrepared, IBookingResponse, IBookingHotelServiceProxyResponse } from "../interfaces/booking.interface";
import hotelMap from "../models/accommodationMap";
import EmailService from "./email.service";
import logger from "../utils/logger";
import ProxyService from "./proxy.service";
import { IBoard, IRoom } from "../interfaces/acccommodationMap.interface";
import hotelModel from "../models/hotel";
import bookingModel from "../models/booking";
import HotelServiceAPI from "./hotelService.Api.service";

export default class BookingService {
  static async bookingPrepareSend(bookings: IBooking[], integrationName: string):
    Promise<{ preparedBookings: IBookingPrepared[], errors: number }> {
    try {
      let errors = 0;
      const integration = await ProxyService.getIntegration(integrationName);
      const integrationCode = integration?.code;

      const preparedBookings: IBookingPrepared[] = await Promise.all(
        bookings.map(async (booking) => {
          const preparedHotelServices = await Promise.all(
            booking.hotelServices.map(async (hts) => {

              const hotel = await hotelModel.findOne(
                { _id: hts.hotelId },
              ).lean();

              const hasVoucher = booking.log?.response?.Vocher;

              if (
                booking.action === "Changed" &&
                hts.serviceName.match(/.*penalty.*/gim)
              ) {
                booking.action = "Cancel";
              } else if (booking.action === "Changed" && !hasVoucher) {
                booking.action = "New";
              }

              const mappings = await hotelMap.findOne({ _id: hts.hotelId }).lean();

              if (
                !mappings ||
                !(mappings.rooms[hts.roomMapCode]?.[integrationCode as keyof IRoom]) ||
                !(mappings.boards[hts.pansionId]?.[integrationCode as keyof IBoard])
              ) {
                await EmailService.sendEmail({
                  type: "error",
                  booking: booking.bookingName,
                  hotel: hts.hotel,
                });

                errors++;

                return null;
              }

              return {
                ...hts,
                roomIntegrationCode: mappings.rooms[hts.roomMapCode]?.[integrationCode as keyof IRoom],
                boardIntegrationCode: mappings.boards[hts.pansionId]?.[integrationCode as keyof IBoard],
                integrationSetings: hotel?.integrationSettings,
              } as IBookingHotelServicePrepared;

            })
          )

          booking.hotelServices = preparedHotelServices.filter(Boolean) as IBookingHotelServicePrepared[];

          return booking;
        })
      )

      const filteredPreparedBookings = preparedBookings.filter((booking) => {
        const hotelServices = (booking.hotelServices as IBookingHotelServicePrepared[]).filter((hts) => {
          return hts.roomIntegrationCode && hts.boardIntegrationCode;
        });
        booking.hotelServices = hotelServices;
        return hotelServices.length > 0;
      });

      return { preparedBookings: filteredPreparedBookings, errors };
    } catch (error) {
      logger.error(error);
      return { preparedBookings: [], errors: 0 };

    }
  }

  static async bookingResponseProcessing(bookings: IBookingResponse[], status: 'confirm' | 'notConfirmed'): Promise<void> {
    Promise.all(bookings.map(async (booking) => {
      Promise.all(booking.hotelServices.map(async (hts: IBookingHotelServiceProxyResponse) => {

        await EmailService.sendEmail({
          type: status === 'confirm' ? "confirmation" : "notConfirmed",
          booking: booking.bookingName,
          hotel: hts.hotel,
        });

        await HotelServiceAPI.manageBooking(
          hts.serviceId,
          status,
          hts.confirmationNumber || "",
          hts.msgConfirmation || "",
        );

        const log = await bookingModel.create(booking);
        console.log({ booking, log })

      })
      );
    })
    );
  }
}
