import { Controller, Get, Path, Query, Route, Security, Tags } from "tsoa";
import logger from "../utils/logger";
import ProxyService from "../services/proxy.service";

@Route("integrations")
@Tags("integrations")
export class IntegrationController extends Controller {
  @Get("")
  @Security("jwt-passport")
  public async getIntegrations() {
    try {
      return await ProxyService.getIntegrations();
    } catch (error) {
      logger.error(error);
    }
  }

  @Get("accommodations/{hotelId}")
  @Security("jwt-passport")
  public async getIntegrationHotelAccommodations(
    @Path() hotelId: number,
    @Query() integrationName: string,
  ): Promise<{ rooms: string[]; boards: string[] }> {
    return await ProxyService.getAccommodations(integrationName, hotelId);
  }
}
