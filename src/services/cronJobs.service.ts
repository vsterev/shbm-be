import InterlookServiceAPI from "./interlook.Api.service";
import hotelModel from "../models/hotel";
import logger from "../utils/logger";
import mongoose from "mongoose";

export default class CronJobsService {
  public static async getHotels() {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const hotels = await InterlookServiceAPI.getHotels();
      for (const hotel of hotels) {
        await hotelModel.findOneAndUpdate(
          { _id: hotel._id },
          { $set: hotel },
          {
            upsert: true,
            session,
          },
        );
      }
      await session.commitTransaction();
      return logger.info(
        `${hotels.length} hotels are synchronized with Interlook`,
      );
    } catch (error) {
      await session.abortTransaction();
      logger.error(error);
    } finally {
      session.endSession();
    }
  }
}
