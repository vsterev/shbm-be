import logger from "../utils/logger";
import envVariables from "../config/envVariables";
import { HotelResponse } from "../interfaces/hotel.interface";
import {
  IBookingPrepared,
  IBookingResponse,
} from "../interfaces/booking.interface";

export default class ProxyService {
  static async getIntegrations(): Promise<
    { name: string; displayName: string; code: string }[] | undefined
  > {
    try {
      const promiseResult = await fetch(
        `${envVariables.PROXY_URL}/integrations/`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: `BEARER ${envVariables.API_TOKEN}`,
          },
        },
      );
      return promiseResult.json();
    } catch (error) {
      logger.error(error);
    }
  }

  static async getIntegration(
    integrationName: string,
  ): Promise<{ name: string; displayName: string; code: string } | undefined> {
    try {
      const promiseResult = await fetch(
        `${envVariables.PROXY_URL}/integration/${integrationName}`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: `BEARER ${envVariables.API_TOKEN}`,
          },
        },
      );
      return promiseResult.json();
    } catch (error) {
      logger.error(error);
    }
  }

  static async getHotels(integrationName: string): Promise<HotelResponse[]> {
    const promiseResult = await fetch(
      `${envVariables.PROXY_URL}/hotels?` +
        new URLSearchParams({ integrationName }).toString(),
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `BEARER ${envVariables.API_TOKEN}`,
        },
      },
    );
    return promiseResult.json();
  }

  static async getAccommodations(
    integrationName: string,
    hotelId: number,
  ): Promise<{ rooms: []; boards: [] }> {
    const promiseResult = await fetch(
      `${envVariables.PROXY_URL}/hotel-accommodations/${hotelId}?` +
        new URLSearchParams({ integrationName }).toString(),
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `BEARER ${envVariables.API_TOKEN}`,
        },
      },
    );
    return promiseResult.json();
  }

  static async sendBookings(
    integrationName: string,
    bookings: IBookingPrepared[],
    flag: "new" | "change" | "cancel",
  ): Promise<{
    errors: { booking: string; hotel: string }[];
    processedBookings: IBookingResponse[];
  }> {
    const promiseResult = await fetch(
      `${envVariables.PROXY_URL}/bookings?` +
        new URLSearchParams({ integrationName, flag }).toString(),
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `BEARER ${envVariables.API_TOKEN}`,
        },
        body: JSON.stringify(bookings),
      },
    );
    if (!promiseResult.ok) {
      const errorText = await promiseResult.text();
      throw new Error(`Error: ${promiseResult.status} - ${errorText}`);
    }
    return promiseResult.json();
  }
}
