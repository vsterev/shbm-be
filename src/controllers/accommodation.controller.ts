import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Path,
  Post,
  Queries,
  Res,
  Route,
  Security,
  Tags,
  TsoaResponse,
} from "tsoa";
import hotelModel from "../models/hotel";
import accomodationMap from "../models/accommodationMap";
import {
  IAccommodationMap,
  IBoard,
  IRoom,
} from "../interfaces/acccommodationMap.interface";
import InterlookServiceAPI from "../services/interlook.Api.service";
import logger from "../utils/logger";

@Route("accommodations")
@Tags("accommodations")
export class AccommodationController extends Controller {
  @Get("")
  @Security("jwt-passport")
  public async getVariants(
    @Queries()
    query: {
      ilCode: number;
      integrationName: string;
    },
  ): Promise<IAccommodationMap | undefined> {
    const result = await accomodationMap.findOne({
      _id: query.ilCode,
      integrationName: query.integrationName,
    });

    if (!result) {
      return {} as IAccommodationMap;
    }

    return result;
  }

  @Post("")
  @Security("jwt-passport")
  public async createHotelVariant(
    @Body()
    body: {
      ilCode: number;
      checkIn: string;
      checkOut: string;
      integrationName: string;
    },
    @Res() notFoundRes: TsoaResponse<404, { error: string }>,
  ) {
    try {
      const hotel = await hotelModel.findOne({ _id: Number(body.ilCode) });
      if (!hotel) {
        throw notFoundRes(404, { error: "Hotel map not found" });
      }
      const variants = await InterlookServiceAPI.getCalculationVariants(
        body.ilCode,
        body.checkIn,
        body.checkOut,
      );

      const { roomVariants, boardVariants } = variants;

      await accomodationMap.findByIdAndUpdate(
        +hotel._id,
        {
          _id: +hotel._id,
          rooms: roomVariants,
          boards: boardVariants,
          hotelName: hotel.name,
          // hotelId: +hotel._id,
          // hotelCode,
          // cityId,
          // cityName,
          // ------
          // [body.integrationCode as keyof IHotel['integrationSettings']]: hotel[body.integrationCode as keyof IHotel['integrationSettings']],
          // parserName,
          // parserHotelServer,
          integrationName: body.integrationName,
        },
        { upsert: true, new: true },
      );
    } catch (error) {
      logger.error(error);
      notFoundRes(404, { error: (error as Error).message });
    }
  }

  @Patch("")
  @Security("jwt-passport")
  public async hotelMapProperties(
    @Body()
    body: {
      boards: { [key: string]: IBoard };
      rooms: { [key: string]: IRoom };
      hotelId: number;
      integrationName: string;
    },
  ): Promise<IAccommodationMap | undefined> {
    try {
      const { hotelId, boards, rooms } = body;

      const updateHotelMap = await accomodationMap.findOneAndUpdate(
        { _id: hotelId, integrationName: body.integrationName },
        { boards, rooms },
        { new: true },
      );
      return updateHotelMap || undefined;
    } catch (error) {
      logger.error(error);
    }
  }

  @Delete("{id}")
  @Security("jwt-passport")
  public async deleteHotelAccommodationMap(@Path() id: number): Promise<void> {
    try {
      await accomodationMap.findByIdAndDelete(id);
    } catch (error) {
      logger.error(error);
    }
  }
}
