import { Body, Controller, Get, Post, Route, Security, Tags } from "tsoa";
import ParsersingApiService from "../services/parsing.Api.service";
import hotelModel from "../models/hotel";
import logger from "../utils/logger";
import { IParsingHotelResponse } from "../interfaces/parsing.interface";
import parserReportModel from "../models/parserReport";

@Route("parser")
@Tags("parser")
export class ParserController extends Controller {
  @Get("hotels-compare")
  @Security("jwt-passport")
  public async hotelCompare() {
    try {
      const parserHotels = await ParsersingApiService.getHotels();

      const interlookHotels = (await hotelModel.find())
        .filter((hotel) => hotel.parserCode)
        .map((hotel) => hotel.parserCode);
      const mappedParserHotels: (IParsingHotelResponse & {
        mapped: boolean;
      })[] =
        parserHotels?.map((hotel) => {
          if (interlookHotels.includes(hotel.HotelID)) {
            return { ...hotel, mapped: true };
          }
          return { ...hotel, mapped: false };
        }) || [];

      return { parserHotels: mappedParserHotels, interlookHotels };
    } catch (error) {
      logger.error(error);
    }
  }

  @Post("hotel-props")
  @Security("jwt-passport")
  public async getHotelProps(@Body() body: { parserCode: number }) {
    const parsingBoards = await ParsersingApiService.getBoards(body.parserCode);
    const parsingRooms = await ParsersingApiService.getRooms(body.parserCode);
    return { boards: parsingBoards, rooms: parsingRooms };
  }

  @Post("reports")
  @Security("jwt-passport")
  public async getReports(@Body() body: { skip?: number; limit?: number }) {
    const limit = body.limit || 100;
    const skip = body.skip || 0;
    return parserReportModel
      .find()
      .sort({ dateInputed: -1 })
      .limit(limit)
      .skip(skip);
  }

  // @Post("hotel-props")
  // public async getHotelProps(@Body() body: { parserCode: string }) {
  //   const parsingBoards = await ParsersingApiService.getBoards(body.parserCode);
  //   const parsingRooms = await ParsersingApiService.getRooms(body.parserCode);
  //   return { boards: parsingBoards, rooms: parsingRooms };
  // }

  // @Post("new-reserv")
  // public async createResvation(@Body() body: { hotelId: string }) {

  // }
}
