import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Queries,
  Query,
  Res,
  Route,
  Security,
  Tags,
  TsoaResponse,
} from "tsoa";
import hotelModel from "../models/hotel";
import hotelMapModel from "../models/hotelMap";
import { IHotelMap } from "../interfaces/hotelMap.interface";
import InterlookServiceAPI from "../services/interlook.Api.service";
import { IHotel } from "../interfaces/hotel.interface";
import ParsingAPI from "../services/parsing.Api.service";
import logger from "../utils/logger";
/* eslint-disable @typescript-eslint/no-explicit-any */

@Route("hotels")
@Tags("hotels")
export class HotelController extends Controller {
  @Get("mapping-variants")
  @Security("jwt-passport")
  public async getVariants(
    // @Body() body: { parserCode?: number; ilCode: number },
    @Queries() query: { parserCode?: number; ilCode: number },
    @Res() notFoundRes: TsoaResponse<404, { error: string }>,
  ): Promise<IHotelMap | undefined> {
    // if (body.parserCode) {
    const result = await hotelMapModel.findOne(
      query.parserCode
        ? { parserCode: query.parserCode, _id: query.ilCode }
        : { _id: query.ilCode },
    );
    if (!result) {
      return notFoundRes(404, { error: "Hotel map not found" });
    }
    return result;
    // }
    // if (body.ilCode) {
    //   const result = await hotelMapModel.findOne({ _id: +body.ilCode });
    //   if (!result) {
    //     return notFoundRes(404, { error: "Hotel map not found" });
    //   }
    //   return result;
    // }
  }

  @Get("mapped")
  @Security("jwt-passport")
  public async getAllMapped() {
    // @Request() req: Express.Request
    try {
      // return hotelMapModel.find({ parserCode: { $exists: true } });
      //VAJNO DA SE PROVERI
      return hotelModel.find({ parserCode: { $exists: true } });
    } catch (error) {
      logger.error(error);
    }
  }

  @Post("mapping-variants")
  @Security("jwt-passport")
  public async createHotelVariant(
    @Body() body: { ilCode: number; checkIn: string; checkOut: string },
    @Res() notFoundRes: TsoaResponse<404, { error: string }>,
  ): Promise<void> {
    try {
      const hotel = await hotelModel.findOne({ _id: Number(body.ilCode) });
      if (!hotel) {
        throw notFoundRes(404, { error: "Hotel map not found" });
      }
      return await InterlookServiceAPI.getCalculationVariants(
        hotel,
        body.checkIn,
        body.checkOut,
      );
    } catch (error) {
      logger.error(error);
      notFoundRes(404, { error: (error as Error).message });
    }
  }

  @Get("")
  @Security("jwt-passport")
  public async findHotelByname(@Query() hotelName: string): Promise<IHotel[]> {
    const str = new RegExp(hotelName, "i");
    return hotelModel.find({ name: str });
  }

  @Patch("")
  @Security("jwt-passport")
  public async hotelMap(
    @Body() body: { parserCode: number; hotelId: number },
    @Res() notFoundRes: TsoaResponse<404, { error: string }>,
  ): Promise<IHotel | undefined> {
    try {
      const parsingHotels = (await ParsingAPI.getHotels()) as
        | {
            Hotel: string;
            HotelServer: string;
            HotelId: number;
          }[]
        | undefined;
      const parserHotel = parsingHotels?.find(
        (el: any) => el.HotelID === +body.parserCode,
      );
      if (!parserHotel) {
        throw notFoundRes(404, {
          error: "Hotel with Id not found in Legacy Hotel Information",
        });
      }
      const updatedHotel = await hotelModel.findOneAndUpdate(
        { _id: body.hotelId },
        {
          parserCode: body.parserCode,
          parserName: body.parserCode ? parserHotel?.Hotel : "",
          parserHotelServer: body.parserCode ? parserHotel?.HotelServer : "",
        },
        { new: true },
      );
      return updatedHotel || undefined;
    } catch (error) {
      logger.error(error);
    }
  }

  @Patch("mapping-variants")
  @Security("jwt-passport")
  public async hotelMapProperties(
    @Body() body: { boards: any; rooms: any; hotelId: number },
  ): Promise<IHotelMap | undefined> {
    try {
      const { hotelId, boards, rooms } = body;

      const updateHotelMap = await hotelMapModel.findOneAndUpdate(
        { hotelId },
        { boards, rooms },
        { new: true },
      );
      return updateHotelMap || undefined;
    } catch (error) {
      logger.error(error);
    }
  }

  @Delete("mapping-variants")
  @Security("jwt-passport")
  public async deleteHotelMap(
    @Body() body: { hotelId: number },
  ): Promise<void> {
    try {
      await hotelModel.findByIdAndUpdate(
        body.hotelId,
        { $unset: { parserCode: "", parserHotelServer: "", parserName: "" } },
        { new: true },
      );
      await hotelMapModel.findByIdAndDelete(body.hotelId);
    } catch (error) {
      logger.error(error);
    }
  }
}
