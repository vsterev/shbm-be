import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  Route,
  Security,
  Tags,
  TsoaResponse,
} from "tsoa";
import cityModel from "../models/city";
// import hotelModel from "../models/hotel";
import InterlookServiceAPI from "../services/interlook.Api.service";
import mongoose from "mongoose";
import logger from "../utils/logger";
import HotelServiceAPI from "../services/hotelService.Api.service";
import HotelService from "../services/hotelService.service";
import { IBooking } from "../interfaces/booking.interface";
import ParsingService from "../services/parsing.service";

@Route("il")
@Tags("interlook")
export class InterlookController extends Controller {
  @Get("get-cities")
  @Security("jwt-passport")
  public async getCities() {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const interlookCities = await InterlookServiceAPI.getCities();
      await cityModel.collection.drop({ session });
      const inserted = await cityModel.insertMany(interlookCities, {
        session,
        ordered: false,
      });
      await session.commitTransaction();
      logger.info(`${inserted.length} cities are synchronized with Interlook`);
      return inserted;
    } catch (error) {
      logger.error(error);
      await session.abortTransaction();
    } finally {
      session.endSession();
    }
  }

  // @Get("get-hotels")
  // @Security("jwt-passport")
  // public async getHotels() {
  //   const session = await mongoose.startSession();
  //   session.startTransaction();
  //   try {
  //     const intertlookHotels = await InterlookServiceAPI.getHotels();
  //     await hotelModel.collection.drop({ session });

  //     const inserted = await hotelModel.insertMany(intertlookHotels);
  //     await session.commitTransaction();
  //     logger.info(`${inserted.length} hotels are synchronized with Interlook`);
  //     return inserted;
  //   } catch (error) {
  //     logger.error(error);
  //     await session.abortTransaction();
  //   } finally {
  //     session.endSession();
  //   }
  // }

  @Post("get-bookings")
  @Security("jwt-passport")
  public async getBookings(
    @Body() body: { action: "new" | "change" | "cancel"; next: boolean },
    @Res() syncFailed: TsoaResponse<422, { error: string }>,
  ) {
    try {
      const newBookings = await HotelServiceAPI.getNewBookings(body.action);

      const bookings = HotelService.deserializeXMLBooking(
        newBookings || [],
        body.action,
      );
      return bookings;
    } catch (error) {
      logger.error(error);
      syncFailed(422, { error: (error as Error).message });
    }
  }

  @Post("send-bookings")
  @Security("jwt-passport")
  public async sendBookings(@Body() body: { bookings: IBooking[] }) {
    try {
      return ParsingService.bookingPrepare(body.bookings);
    } catch (error) {
      logger.error(error);
    }
  }
}
