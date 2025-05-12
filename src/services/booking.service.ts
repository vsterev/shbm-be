import {
  IBooking,
  IBookingPrepared,
  IBookingHotelServicePrepared,
  IBookingResponse,
  IBookingHotelServiceProxyResponse,
} from "../interfaces/booking.interface";
import hotelMap from "../models/accommodationMap";
import EmailService from "./email.service";
import logger from "../utils/logger";
import hotelModel from "../models/hotel";
import bookingModel from "../models/booking";
import HotelServiceAPI from "./hotelService.Api.service";

export default class BookingService {
  static async bookingPrepareSend(
    bookings: IBooking[],
  ): Promise<{ preparedBookings: IBookingPrepared[]; errors: number }> {
    try {
      let errors = 0;
      const preparedBookings: IBookingPrepared[] = await Promise.all(
        bookings.map(async (booking) => {
          const preparedHotelServices = await Promise.all(
            booking.hotelServices.map(async (hts) => {
              const hotel = await hotelModel
                .findOne({ _id: hts.hotelId })
                .lean();

              const isBookingSend = await bookingModel
                .find({
                  bookingId: booking.bookingId,
                  "hotelServices.serviceId": hts.serviceId,
                  "hotelServices.log.response": { $exists: true },
                })
                .lean();

              if (
                booking.action === "Changed" &&
                hts.serviceName.match(/.*penalty.*/gim)
              ) {
                booking.action = "Cancel";
              } else if (
                // if booking was cheange before send to integration, in this case it will not be exists in integration app
                booking.action === "Changed" &&
                !isBookingSend?.length
              ) {
                booking.action = "New";
              }

              if (booking.action === "Cancel") {
                hts.log = isBookingSend[0].hotelServices[0].log;
              }

              const mappings = await hotelMap
                .findOne({ _id: hts.hotelId })
                .lean();

              if (
                !mappings ||
                !mappings.rooms[hts.roomMapCode]?.integrationCode ||
                !mappings.boards[hts.pansionId]?.integrationCode
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
                roomIntegrationCode:
                  mappings.rooms[hts.roomMapCode].integrationCode,
                boardIntegrationCode:
                  mappings.boards[hts.pansionId]?.integrationCode,
                integrationSettings: hotel?.integrationSettings,
              } as IBookingHotelServicePrepared;
            }),
          );

          booking.hotelServices = preparedHotelServices.filter(
            Boolean,
          ) as IBookingHotelServicePrepared[];

          return booking;
        }),
      );

      const filteredPreparedBookings = preparedBookings.filter((booking) => {
        const hotelServices = (
          booking.hotelServices as IBookingHotelServicePrepared[]
        ).filter((hts) => {
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

  static async bookingResponseProcessing(
    bookings: IBookingResponse[],
  ): Promise<void> {
    Promise.all(
      bookings.map(async (booking) => {
        await Promise.all(
          booking.hotelServices.map(
            async (hts: IBookingHotelServiceProxyResponse) => {
              switch (hts.log?.integrationStatus) {
                case "confirmed":
                  await EmailService.sendEmail({
                    type: "confirmation",
                    booking: booking.bookingName,
                    hotel: hts.hotel,
                  });

                  await HotelServiceAPI.manageBooking(
                    hts.serviceId,
                    "confirm",
                    hts.confirmationNumber || "",
                    hts.msgConfirmation || "",
                  );
                  break;

                case "denied":
                  await EmailService.sendEmail({
                    type: "denied",
                    booking: booking.bookingName || "",
                    hotel: hts.hotel || "",
                  });

                  await HotelServiceAPI.manageBooking(
                    hts.serviceId,
                    "denied",
                    hts.confirmationNumber || "",
                    hts.msgConfirmation || "",
                  );
                  break;

                case "wait":
                  if (hts.status === "Confirmed") {
                    // if Il default status is confirmed and integration status is waiting no status will be changed in IL
                    await HotelServiceAPI.manageBooking(hts.serviceId);

                    await EmailService.sendEmail({
                      type: "pendingApproval",
                      booking: booking.bookingName || "",
                      hotel: hts.hotel || "",
                    });
                    break;
                  }

                  //should hide booking from queue
                  await EmailService.sendEmail({
                    type: "waiting",
                    booking: booking.bookingName || "",
                    hotel: hts.hotel || "",
                  });

                  await HotelServiceAPI.manageBooking(
                    hts.serviceId,
                    "wait",
                    hts.confirmationNumber || "",
                    hts.msgConfirmation || "",
                  );
                  break;

                case "cancelled":
                  await EmailService.sendEmail({
                    type: "cancellation",
                    booking: booking.bookingName || "",
                    hotel: hts.hotel || "",
                  });
                  //should hide booking from queue
                  await HotelServiceAPI.manageBooking(hts.serviceId, "confirm");
                  break;

                default:
                  return null;
              }
            },
          ),
        );
        await bookingModel.create(booking);
      }),
    );
  }
}
