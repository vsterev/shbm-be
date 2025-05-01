import {
  Body,
  Controller,
  Get,
  Post,
  Queries,
  Res,
  Route,
  Security,
  Tags,
  TsoaResponse,
} from "tsoa";
import bookingModel from "../models/booking";
import {
  IBooking,
  IParserBooking,
  IParserBookingResponse,
} from "../interfaces/booking.interface";
import HotelServiceAPI from "../services/hotelService.Api.service";
import EmailService from "../services/email.service";
import logger from "../utils/logger";
import BookingService from "../services/booking.service";
import ProxyService from "../services/proxy.service";

@Route("bookings")
@Tags("bookings")
export class BookingController extends Controller {
  @Get("search")
  @Security("jwt-passport")
  public async searchBooking(
    @Queries()
    query: {
      dateFrom: string;
      dateTo: string;
      booking: string;
      isCreateDate: boolean;
      limit: number;
      skip: number;
    },
  ): Promise<{ bookings: IBooking[]; count: number }> {
    const { dateFrom, dateTo, booking, isCreateDate } = query;

    const searchStr = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let obj: { [key: string]: any } = {};
      if (booking) {
        obj = { ...obj, bookingName: booking };
      }
      if (dateFrom && !isCreateDate) {
        obj = { ...obj, ["hotelServices.checkIn"]: { $gte: dateFrom } };
      } else if (dateFrom && isCreateDate) {
        obj = {
          ...obj,
          ["hotelServices.log.sendDate"]: { $gte: new Date(dateFrom) },
        };
      }
      if (dateTo && !isCreateDate) {
        obj["hotelServices.checkIn"] = {
          ...obj["hotelServices.checkIn"],
          $lte: dateTo,
        };
      } else if (dateTo && isCreateDate) {
        obj["log.sendDate"] = {
          ...obj["hotelServices.log.sendDate"],
          $lte: new Date(dateTo),
        };
      }
      // if (!booking||!dateFrom||!dateTo) {
      //     console.log('please fill in the fields')
      //     // throw new Error('please fill in the fields')
      //     res.status(530).json('please fill in the fields')
      // }
      return obj;
    };

    const limit = Number(query.limit) || 100;
    const skip = Number(query.skip) || 0;

    const bookings = await bookingModel
      .find(searchStr())
      .sort({ dateInputed: -1 })
      .limit(limit)
      .skip(skip);

    const count = await bookingModel.countDocuments(searchStr());

    return { bookings, count };
  }

  @Post("confirm")
  @Security("api-token")
  public async confirmBooking(
    @Body()
    body: {
      bookingNumber: string;
      confirmationNumber: string;
      message: string;
      partnerBookingId?: string;
    },
    @Res() notFoundRes: TsoaResponse<404, { error: string }>,
  ): Promise<string> {
    const booking = await bookingModel
      .findOne({
        "hotelServices.serviceId": Number(body.bookingNumber.split("-")[1]),
        "hotelServices.log.integrationId": body.partnerBookingId || "",
      })
      .sort({ dateInputed: -1 })
      .lean();

    if (!booking) {
      throw notFoundRes(404, {
        error: "Hotel service information is missing in the booking.",
      });
    }

    const { serviceId, hotel } = booking.hotelServices[0];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...newBooking } = booking;

    newBooking.dateInputed = new Date();

    newBooking.hotelServices[0].log = {
      send: {} as IParserBooking,
      response: {} as IParserBookingResponse,
      manual: { confirmed: body },
      sendDate: new Date(),
      integrationStatus: "confirmed",
      integrationId: body.partnerBookingId || "",
    };

    if (newBooking.hotelServices[0]) {
      newBooking.hotelServices[0].status = "Confirmed";
    }

    await bookingModel.create(newBooking);

    await HotelServiceAPI.manageBooking(
      serviceId,
      "confirm",
      body.confirmationNumber,
      body.message,
    );

    await EmailService.sendEmail({
      type: "confirmation",
      booking: newBooking.bookingName,
      hotel,
    });

    return "booking confirmation was received";
  }

  @Get("partner")
  @Security("api-token")
  public async findPartnerBooking(
    @Queries() query: { bookingCode: string; partnerId: string },
  ): Promise<boolean> {
    const bookingExists = await bookingModel.findOne({
      "hotelServices.bookingCode": query.bookingCode,
      "hotelServices.log.integrationId": query.partnerId,
    });

    if (!bookingExists) {
      return false;
    }

    return true;
  }

  @Post("deny")
  @Security("api-token")
  public async denyBooking(
    @Body()
    body: {
      bookingNumber: string;
      message: string;
      partnerBookingId?: string;
    },
    @Res() notFoundRes: TsoaResponse<404, { error: string }>,
  ): Promise<string> {
    const booking = await bookingModel
      .findOne({
        "hotelServices.serviceId": Number(
          Number(body.bookingNumber.split("-")[1]),
        ),
        "hotelServices.log.integrationId": body.partnerBookingId || "",
      })
      .sort({ dateInputed: -1 })
      .lean();

    if (!booking) {
      throw notFoundRes(404, {
        error: "Hotel service information is missing in the booking.",
      });
    }

    const { serviceId, hotel, status } = booking.hotelServices[0];

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...newBooking } = booking;

    newBooking.dateInputed = new Date();

    newBooking.hotelServices[0].log = {
      send: {} as IParserBooking,
      response: {} as IParserBookingResponse,
      manual: { denied: body },
      sendDate: new Date(),
      integrationStatus: "denied",
      integrationId: body.partnerBookingId || "",
    };

    let returnStr = "";

    if (status === "Wait" && newBooking.hotelServices[0]) {
      newBooking.hotelServices[0].status = "notConfirmed";

      await HotelServiceAPI.manageBooking(
        serviceId,
        "notConfirmed",
        "OTKAZ!",
        body.message,
      );

      await EmailService.sendEmail({
        type: "notConfirmed",
        booking: newBooking.bookingName,
        hotel,
      });

      returnStr = "booking Not confirmed status was received";
    } else {
      booking.hotelServices[0].status = "Wait";

      await HotelServiceAPI.manageBooking(
        serviceId,
        "wait",
        "OTKAZ!",
        body.message,
      );

      await EmailService.sendEmail({
        type: "denied",
        booking: newBooking.bookingName,
        hotel,
      });

      returnStr = "booking denied status was received";
    }

    await bookingModel.create(newBooking);

    return returnStr;
  }

  @Get("")
  @Security("jwt-passport")
  public async getBookings(
    @Queries()
    query: {
      integrationName: string;
      status: "new" | "change" | "cancel";
      next: boolean;
    },
    @Res() syncFailed: TsoaResponse<422, { error: string }>,
  ) {
    try {
      const newBookings = await HotelServiceAPI.getBookings(
        query.status,
        query.integrationName,
      );

      const bookings = HotelServiceAPI.deserializeXMLBooking(
        newBookings || [],
        query.status,
      );

      return bookings;
    } catch (error) {
      logger.error(error);
      syncFailed(422, { error: (error as Error).message });
    }
  }

  @Post("")
  @Security("jwt-passport")
  public async sendBookings(
    @Body() bookings: IBooking[],
    @Queries()
    query: { integrationName: string; flag: "new" | "change" | "cancel" },
    @Res() syncFailed: TsoaResponse<422, { error: string }>,
  ) {
    try {
      const completeBookings: IBooking[] = bookings.map((booking) => ({
        ...booking,
        // bookingName: booking.bookingName || "",
        // hotelServices: booking.hotelServices || [],
        action: booking.action || "New",
      })) as IBooking[];

      // eslint-disable-next-line
      let { errors, preparedBookings } =
        await BookingService.bookingPrepareSend(completeBookings);

      const proxyResult = await ProxyService.sendBookings(
        query.integrationName,
        preparedBookings,
        query.flag,
      );

      const { processedBookings, errors: errorsResponse } = proxyResult;

      const sendedBookingsCount = preparedBookings.length;

      const confirmedBookingsCount = processedBookings.filter((booking) =>
        booking.hotelServices.some(
          (hts) => hts.log?.integrationStatus === "confirmed",
        ),
      ).length;

      const deniedBookingsCount = processedBookings.filter((booking) =>
        booking.hotelServices.some(
          (hts) => hts.log?.integrationStatus === "denied",
        ),
      ).length;

      errors = errors + errorsResponse.length;

      await Promise.all(
        errorsResponse.map(async (error) => {
          await EmailService.sendEmail({
            type: "error",
            booking: error.booking,
            hotel: error.hotel,
          });
        }),
      );

      await BookingService.bookingResponseProcessing(processedBookings);

      return {
        errors,
        sended: sendedBookingsCount,
        confirmed: confirmedBookingsCount,
        notConfirmed: deniedBookingsCount,
        cancelled: 0,
      };
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error.message);
      } else {
        logger.error("An unknown error occurred");
      }
      return syncFailed(422, { error: (error as unknown as Error).message });
    }
  }
}
