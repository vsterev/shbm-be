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
import ProxyService from "./proxy.service";
import { IBoard, IRoom } from "../interfaces/acccommodationMap.interface";
import hotelModel from "../models/hotel";
import bookingModel from "../models/booking";
import HotelServiceAPI from "./hotelService.Api.service";

export default class BookingService {
  static async bookingPrepareSend(
    bookings: IBooking[],
    integrationName: string,
  ): Promise<{ preparedBookings: IBookingPrepared[]; errors: number }> {
    try {
      let errors = 0;
      const integration = await ProxyService.getIntegration(integrationName);
      const integrationCode = integration?.code;

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

              const mappings = await hotelMap
                .findOne({ _id: hts.hotelId })
                .lean();

              if (
                !mappings ||
                !mappings.rooms[hts.roomMapCode]?.[
                  integrationCode as keyof IRoom
                ] ||
                !mappings.boards[hts.pansionId]?.[
                  integrationCode as keyof IBoard
                ]
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
                  mappings.rooms[hts.roomMapCode]?.[
                    integrationCode as keyof IRoom
                  ],
                boardIntegrationCode:
                  mappings.boards[hts.pansionId]?.[
                    integrationCode as keyof IBoard
                  ],
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
                  await EmailService.sendEmail({
                    type: "waiting",
                    booking: booking.bookingName || "",
                    hotel: hts.hotel || "",
                  });
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
