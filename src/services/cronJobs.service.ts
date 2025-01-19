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
        console.log(hotel);
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
  public static async getBoards() {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const boards = await InterlookServiceAPI.getBoards();
      for (const board of boards) {
        await hotelModel.findOneAndUpdate(
          { _id: board._id },
          { $set: board },
          { upsert: true, session },
        );
      }
      await session.commitTransaction();
      return logger.info(
        `${boards.length} boards are synchronized with Interlook`,
      );
    } catch (error) {
      await session.abortTransaction();
      logger.error(error);
    } finally {
      session.endSession();
    }
  }
}
