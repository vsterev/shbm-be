import {
  Body,
  Controller,
  Get,
  Post,
  Queries,
  Query,
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
      let obj: { [key: string]: any } = {};
      if (booking) {
        obj = { ...obj, bookingName: booking };
      }
      if (dateFrom && !isCreateDate) {
        obj = { ...obj, ["hotelServices.checkIn"]: { $gte: dateFrom } };
      } else if (dateFrom && isCreateDate) {
        obj = { ...obj, ["log.sendDate"]: { $gte: new Date(dateFrom) } };
      }
      if (dateTo && !isCreateDate) {
        obj["hotelServices.checkIn"] = {
          ...obj["hotelServices.checkIn"],
          $lte: dateTo,
        };
      } else if (dateTo && isCreateDate) {
        obj["log.sendDate"] = { ...obj["log.sendDate"], $lte: new Date(dateTo) };
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
    },
    @Res() notFoundRes: TsoaResponse<404, { error: string }>,
  ): Promise<string> {

    let booking = {} as IBooking;

    if (!body.bookingNumber.includes("-")) {

      booking = await bookingModel
        .findOne({ bookingName: body.bookingNumber })
        .sort({ dateInputed: -1 })
        .lean();
    } else {

      const searchStr = body.bookingNumber.split("-")[1];

      booking = await bookingModel
        .findOne({ "hotelService.serviceId": searchStr })
        .sort({ dateInputed: -1 })
        .lean();
    }
    if (!booking || !booking.hotelServices[0]) {
      throw notFoundRes(404, {
        error: "Hotel service information is missing in the booking.",
      });
    }

    const { serviceId, hotel } = booking.hotelServices[0];

    const { _id, ...newBooking } = booking;

    newBooking.dateInputed = new Date();

    newBooking.log = {
      send: newBooking.log?.send || {} as IParserBooking,
      response: newBooking.log?.response || {} as IParserBookingResponse,
      manual: { confirm: body },
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

  @Post("deny")
  public async denyBooking(
    @Body()
    body: {
      bookingNumber: string;
      message: string;
    },
    @Res() notFoundRes: TsoaResponse<404, { error: string }>,
  ): Promise<string> {

    let booking = {} as IBooking;

    if (!body.bookingNumber.includes("-")) {
      booking = await bookingModel
        .findOne({ bookingName: body.bookingNumber })
        .sort({ dateInputed: -1 })
        .lean();
    } else {
      const searchStr = body.bookingNumber.split("-")[1];

      booking = await bookingModel
        .findOne({ "hotelService.serviceId": searchStr })
        .sort({ dateInputed: -1 })
        .lean();
    }
    if (!booking || !booking.hotelServices[0]) {
      throw notFoundRes(404, {
        error: "Hotel service information is missing in the booking.",
      });
    }

    const { serviceId, hotel, status } = booking.hotelServices[0];

    const { _id, ...newBooking } = booking;

    newBooking.dateInputed = new Date();

    newBooking.log = {
      send: newBooking.log?.send || {} as IParserBooking,
      response: newBooking.log?.response || {} as IParserBookingResponse,
      manual: { deny: body },
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
    @Queries() query: { integrationName: string, status: "new" | "change" | "cancel"; next: boolean },
    @Res() syncFailed: TsoaResponse<422, { error: string }>,
  ) {
    try {
      const newBookings = await HotelServiceAPI.getBookings(query.status, query.integrationName);

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
    @Query() integrationName: string,
  ) {
    try {
      const completeBookings: IBooking[] = bookings.map((booking) => ({
        ...booking,
        // bookingName: booking.bookingName || "",
        // hotelServices: booking.hotelServices || [],
        action: booking.action || "New",
      })) as IBooking[];

      let { errors, preparedBookings } = await BookingService.bookingPrepareSend(completeBookings, integrationName);

      const proxyResult = await ProxyService.sendBookings(integrationName, preparedBookings);

      const { confirmedBookings, deniedBookings, errors: errorsResponse } = proxyResult;

      const sendedBookingsCount = preparedBookings.length;

      const confirmedBookingsCount = confirmedBookings.length;

      const deniedBookingsCount = deniedBookings.length;

      errors = errors + errorsResponse.length;

      await Promise.all(errorsResponse.map(async (error) => {
        await EmailService.sendEmail({
          type: "error",
          booking: error.booking,
          hotel: error.hotel,
        });
      })
      )

      await BookingService.bookingResponseProcessing(confirmedBookings, 'confirm');

      await BookingService.bookingResponseProcessing(deniedBookings, 'notConfirmed');

      return { errors, sended: sendedBookingsCount, confirmed: confirmedBookingsCount, notConfirmed: deniedBookingsCount, cancelled: 0 };
    } catch (error) {
      logger.error(error);
    }
  }
}
