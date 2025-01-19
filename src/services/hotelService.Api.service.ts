import envVariables from "../config/envVariables";
import logger from "../utils/logger";
import xml2js from "xml2js";
import redis from "../config/redis.config";
import hotelMap from "../models/hotelMap";

const parser = new xml2js.Parser();

export default class HotelServiceAPI {
  private static async retrieveToken() {
    let token = await redis.get("hotelServiceToken");

    if (!token) {
      token = (await this.connect()) ?? null;
    }

    if (!token) {
      throw new Error("Error retrieving token from HotelService");
    }

    return token;
  }

  private static getDate() {
    const yesterday = new Date(Date.now() - 86400000);
    let dd: string | number = yesterday.getDate();
    let mm: string | number = yesterday.getMonth() + 1;
    const thisYear = yesterday.getFullYear();
    const nextYear = yesterday.getFullYear() + 1;
    if (dd < 10)
      if (dd < 10) {
        dd = "0" + dd.toString();
      }
    if (mm < 10) {
      mm = "0" + mm.toString();
    }
    return {
      dateFrom: `${thisYear}-${mm}-${dd}`,
      dateTo: `${nextYear}-${mm}-${dd}`,
    };
  }

  public static async connect(): Promise<string | undefined> {
    const connectionStr = `<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
      <Connect xmlns="http://tempuri.org/">
        <login>${envVariables.HOTEL_SERVICE_USER}</login>
        <password>${envVariables.HOTEL_SERVICE_PASSWORD}</password>
      </Connect>
    </soap:Body>
  </soap:Envelope>`;
    try {
      const fetchResponse = await fetch(envVariables.HOTEL_SERVICE_URL, {
        method: "POST",
        body: connectionStr,
        headers: {
          "Content-Type": "text/xml",
        },
      });
      const xmlPromise = await fetchResponse.text();

      const xml = await parser.parseStringPromise(xmlPromise);

      const token =
        xml["soap:Envelope"]["soap:Body"][0]["ConnectResponse"][0][
          "ConnectResult"
        ][0];

      if (!token || token.includes("Invalid login or password")) {
        throw new Error("Invalid login or password");
      }

      redis.set("hotelServiceToken", token);

      redis.expire("hotelServiceToken", 3600);

      return token;
    } catch (error) {
      logger.error(error);
    }
  }

  public static async getNewBookings(
    action: "new" | "change" | "cancel",
    hotelsName?: string[],
  ): Promise<unknown[] | undefined> {
    const token = await this.retrieveToken();

    const requestStr = (hotelIds: number[]) => {
      const checkInFrom = "";
      const checkInTo = "";
      return `<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
      <SearchBookings xmlns="http://tempuri.org/">
        <guid>${token}</guid>
        ${
          hotelIds.length
            ? `<hotelId>\n${hotelIds.map(
                (el) => `<int>${el}</int>`,
              )}\n</hotelId>`
            : ""
        }
        <dateInfo>2</dateInfo>
        <dateFrom>${this.getDate().dateFrom}</dateFrom>
        <dateTo>${this.getDate().dateTo}</dateTo>
        ${checkInFrom && `<checkInFrom>${checkInFrom}</checkInFrom>`}
        ${checkInTo && `<checkInTo>${checkInTo}</checkInTo>`}
        ${action === "new" ? "<New>true</New>" : ""}
        ${action === "change" ? `<change>true</change>` : ""}
        ${action === "cancel" || action === "change" ? `<cancel>true</cancel>` : ""}
        <showConfirmed>true</showConfirmed>
        <inwork>${!action ? "true" : "false"}</inwork>
      </SearchBookings>
    </soap:Body>
  </soap:Envelope>`;
    };

    let hotelIds: number[] = [];

    if (!hotelsName?.length) {
      hotelIds = (await hotelMap.find())
        .map((hotel) => hotel._id)
        .filter((el) => el);
    } else {
      hotelIds = (
        await hotelMap.find({
          parserHotelServer: { $in: hotelsName },
        })
      ).map((hotel) => hotel._id);
    }

    const fetchResponse = await fetch(envVariables.HOTEL_SERVICE_URL, {
      method: "POST",
      body: requestStr(hotelIds),
      headers: {
        "Content-Type": "text/xml",
      },
    });

    const xmlPromise = await fetchResponse.text();

    const xml = await parser.parseStringPromise(xmlPromise);

    const error =
      xml["soap:Envelope"]["soap:Body"]?.[0]?.["soap:Fault"]?.[0]?.[
        "faultstring"
      ][0];

    if (error) {
      throw new Error(error);
    }

    const bookings =
      xml["soap:Envelope"]["soap:Body"][0]["SearchBookingsResponse"][0][
        "SearchBookingsResult"
      ][0]["BookingInfo"];

    if (!bookings) {
      return [];
    }

    return bookings;
  }
  public static async manageBooking(
    serviceId: number,
    status: "confirm" | "wait" | "notConfirmed" | "denied",
    confirmationNumber: string,
    message: string,
  ): Promise<unknown> {
    const token = await this.retrieveToken();
    const ilBookingStatus = {
      confirm: 2,
      wait: 1,
      notConfirmed: 4,
      denied: 3,
    };

    const xmlString = `<soap:Envelope
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xmlns:xsd="http://www.w3.org/2001/XMLSchema"
      xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
      <ManageBooking xmlns="http://tempuri.org/">
      <guid>${token}</guid>
      <hotelServiceId>${serviceId}</hotelServiceId>
      <status>${ilBookingStatus[status]}</status>
      ${
        confirmationNumber
          ? `<hotelConfirmationNumber>${confirmationNumber}</hotelConfirmationNumber>`
          : ""
      }
      ${message ? `<message>${message}</message>` : ""}
      <hotelWorkStatus>true</hotelWorkStatus>
      </ManageBooking>
      </soap:Body>
    </soap:Envelope>`;
    const fetchResponse = await fetch(envVariables.HOTEL_SERVICE_URL, {
      method: "POST",
      body: xmlString,
      headers: {
        "Content-Type": "text/xml",
      },
    });
    return fetchResponse;
  }
}
