import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Path,
  Query,
  Res,
  Route,
  Security,
  Tags,
  TsoaResponse,
} from "tsoa";
import hotelModel from "../models/hotel";
import accomodationMap from "../models/accommodationMap";
import { IHotel } from "../interfaces/hotel.interface";
import logger from "../utils/logger";
import ProxyService from "../services/proxy.service";
import { HotelResponse } from "../interfaces/hotel.interface";
/* eslint-disable @typescript-eslint/no-explicit-any */

@Route("hotels")
@Tags("hotels")
export class HotelController extends Controller {
  @Get("mapped/{integrationName}")
  @Security("jwt-passport")
  public async getAllMapped(@Path() integrationName: string) {
    try {
      return hotelModel.find({
        // [integrationCode]: { $exists: true, $nin: [null, '', 0] }
        [`integrationSettings.apiName`]: integrationName,
      });
    } catch (error) {
      logger.error(error);
    }
  }

  @Get("all")
  @Security("jwt-passport")
  public async getInterlookAndIntegrationHotels(
    @Query() integrationName: string,
  ) {
    try {
      const integrations = await ProxyService.getIntegrations();

      const integration = integrations?.find(
        (integration) => integration.name === integrationName,
      );

      if (!integration) {
        return { integrationHotels: [], interlookHotels: [] };
      }

      const integrationHotels = await ProxyService.getHotels(integrationName);

      // const interlookHotels = (await hotelModel.find())
      //   .filter((hotel) => hotel[integration.code as keyof IHotel])
      //   .map((hotel) => hotel[integration.code as keyof IHotel]);

      const interlookHotelsApi = await hotelModel
        .find({ [`integrationSettings.apiName`]: integrationName })
        .lean();

      const codesFromInterlookHotelsApi = interlookHotelsApi.map((hotel) =>
        Number(hotel.integrationSettings?.hotelCode),
      );

      const mappedIntegrationHotels: (HotelResponse & {
        mapped: boolean;
      })[] =
        integrationHotels?.map((hotel) => {
          if (codesFromInterlookHotelsApi.includes(hotel.hotelId)) {
            return { ...hotel, mapped: true };
          }
          return { ...hotel, mapped: false };
        }) || [];

      return { integratedHotels: mappedIntegrationHotels, interlookHotelsApi };
    } catch (error) {
      logger.error(error);
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
    @Body()
    body: {
      integrationName: string;
      integrationValue: number;
      hotelId: number;
    },
    @Res() notFoundRes: TsoaResponse<404, { error: string }>,
    @Res() errorEditHotelMap: TsoaResponse<422, { message: string }>,
  ): Promise<IHotel | undefined> {
    try {
      const integrationHotels = await ProxyService.getHotels(
        body.integrationName,
      );

      const integration = await ProxyService.getIntegration(
        body.integrationName,
      );

      if (!integration) {
        throw notFoundRes(404, {
          error: "Integration with this name not found",
        });
      }

      const integrationHotel = integrationHotels?.find(
        (el: any) => el.hotelId === body.integrationValue,
      );

      if (!integrationHotel) {
        throw notFoundRes(404, {
          error: "Hotel with Id not found in Legacy Hotel Information",
        });
      }

      const integrationCodeIsAssigned = await hotelModel.findOne({
        ["integrationSettings.hotelCode"]: body.integrationValue,
        _id: { $ne: body.hotelId },
      });

      if (integrationCodeIsAssigned) {
        throw errorEditHotelMap(422, {
          message: `Hotel with Id ${body.integrationValue} already assigned to another hotel`,
        });
      }

      const isHotelMapped = await hotelModel.findOne({
        ["integrationSettings.hotelCode"]: {
          $exists: true,
          $nin: [null, "", 0],
        },
        ["integrationSettings.apiName"]: { $nin: [body.integrationName] },
        _id: body.hotelId,
      });

      if (isHotelMapped) {
        throw errorEditHotelMap(422, {
          message: `Hotel allready was mapped for integration ${isHotelMapped.integrationSettings?.apiName}`,
        });
      }
      const updatedHotel = await hotelModel.findOneAndUpdate(
        { _id: body.hotelId },
        {
          [`integrationSettings.hotelCode`]: body.integrationValue,
          [`integrationSettings.apiName`]: body.integrationName,
          ["integrationSettings.hotelServer"]:
            integrationHotel.settings.hotelServer,
          ["integrationSettings.hotelServerId"]:
            integrationHotel.settings.hotelServerId,
          ["integrationSettings.serverName"]:
            integrationHotel.settings.serverName,
          // [integration.code]: body.integrationValue,
          // parserName: body.parserCode ? parserHotel?.Hotel : "",
          // parserHotelServer: body.parserCode ? parserHotel?.HotelServer : "",
        },
        { new: true },
      );

      return updatedHotel || undefined;
    } catch (error) {
      logger.error(error);
    }
  }

  @Delete("")
  @Security("jwt-passport")
  public async deleteHotel(
    @Body() body: { hotelId: number; integrationName: string },
  ): Promise<void> {
    try {
      const integration = await ProxyService.getIntegration(
        body.integrationName,
      );

      if (!integration) {
        throw new Error("Integration not found");
      }

      await hotelModel.findByIdAndUpdate(
        body.hotelId,
        {
          $unset: { integrationSettings: 1 },
        },
        { new: true },
      );

      await accomodationMap.findByIdAndDelete(body.hotelId);
    } catch (error) {
      logger.error(error);
    }
  }
}
