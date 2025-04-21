import { Controller, Get, Route, Security, Tags } from "tsoa";
import cityModel from "../models/city";
import InterlookServiceAPI from "../services/interlook.Api.service";
import mongoose from "mongoose";
import logger from "../utils/logger";

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
}
