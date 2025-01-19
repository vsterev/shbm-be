/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
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

@Route("bookings")
@Tags("bookings")
export class BookingController extends Controller {
  @Get("")
  @Security("jwt-passport")
  public async getAllBooking(
    @Queries()
    query: {
      dateFrom: string;
      dateTo: string;
      booking: string;
      isByDate: "yes" | "no";
      limit: number;
      skip: number;
    },
  ): Promise<IBooking[]> {
    const { dateFrom, dateTo, booking, isByDate } = query;
    const searchStr = () => {
      let obj: { [key: string]: any } = {};
      if (booking) {
        obj = { ...obj, bookingName: booking };
      }
      if (dateFrom && isByDate === "no") {
        obj = { ...obj, ["hotelService.checkIn"]: { $gte: dateFrom } };
      } else if (dateFrom && isByDate === "yes") {
        obj = { ...obj, dateInputed: { $gte: dateFrom } };
      }
      if (dateTo && isByDate === "no") {
        obj["hotelService.checkIn"] = {
          ...obj["hotelService.checkIn"],
          $lte: dateTo,
        };
      } else if (dateTo && isByDate === "yes") {
        obj.dateInputed = { ...obj.dateInputed, $lte: dateTo };
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
    return bookingModel
      .find(searchStr())
      .sort({ dateInputed: -1 })
      .limit(limit)
      .skip(skip);
  }

  @Get("length")
  @Security("jwt-passport")
  public async getLength(
    @Queries()
    query: {
      dateFrom: string;
      dateTo: string;
      booking: string;
      isByDate: "yes" | "no";
      limit?: number;
      skip?: number;
    },
  ): Promise<number> {
    const { dateFrom, dateTo, booking, isByDate } = query;

    const searchStr = () => {
      let obj: { [key: string]: any } = {};
      if (booking) {
        obj = { ...obj, bookingName: booking };
      }
      if (dateFrom && isByDate === "no") {
        obj = { ...obj, ["hotelService.checkIn"]: { $gte: dateFrom } };
      } else if (dateFrom && isByDate === "yes") {
        obj = { ...obj, dateInputed: { $gte: dateFrom } };
      }
      if (dateTo && isByDate === "no") {
        obj["hotelService.checkIn"] = {
          ...obj["hotelService.checkIn"],
          $lte: dateTo,
        };
      } else if (dateTo && isByDate === "yes") {
        obj.dateInputed = { ...obj.dateInputed, $lte: dateTo };
      }
      return obj;
    };
    return bookingModel.countDocuments(searchStr());
  }

  @Post("confirm")
  public async confirmBooking(
    @Body()
    body: {
      booking: string;
      confirmationNumber: string;
      message: string;
    },
    @Res() notFoundRes: TsoaResponse<404, { error: string }>,
  ): Promise<string> {
    let booking = {} as IBooking;
    if (!body.booking.includes("-")) {
      booking = await bookingModel
        .findOne({ bookingName: body.booking })
        .sort({ dateInputed: -1 })
        .lean();
    } else {
      const searchStr = body.booking.split("-")[1];
      booking = await bookingModel
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
      send: {} as IParserBooking,
      response: {} as IParserBookingResponse,
      manual: { confirm: body },
    };
    if (newBooking.hotelService) {
      newBooking.hotelService.status = "Confirmed";
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
      booking: string;
      message: string;
    },
    @Res() notFoundRes: TsoaResponse<404, { error: string }>,
  ): Promise<string> {
    let booking = {} as IBooking;
    if (!body.booking.includes("-")) {
      booking = await bookingModel
        .findOne({ bookingName: body.booking })
        .sort({ dateInputed: -1 })
        .lean();
    } else {
      const searchStr = body.booking.split("-")[1];
      booking = await bookingModel
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
      send: {} as IParserBooking,
      response: {} as IParserBookingResponse,
      manual: { deny: body },
    };
    let returnStr = "";
    if (status === "Wait" && newBooking.hotelService) {
      newBooking.hotelService.status = "notConfirmed";
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
      booking.hotelService.status = "Wait";
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
}
