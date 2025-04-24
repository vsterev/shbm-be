import envVariables from "../config/envVariables";
import logger from "../utils/logger";
import xml2js from "xml2js";
import redis from "../config/redis.config";
import hotelMap from "../models/accommodationMap";
import hotelModel from "../models/hotel";
import {
  IBooking,
  IFlight,
  IHotelServiceBooking,
  IMessage,
  ITourist,
} from "../interfaces/booking.interface";

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
    if (dd < 10) {
      if (dd < 10) {
        dd = "0" + dd.toString();
      }
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

  public static async getBookings(
    status: "new" | "change" | "cancel",
    integrationName: string,
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
            ? `<hotelID>${hotelIds.map(
                (el) => `\t\n<int>${el}</int>`,
              )}\n</hotelID>`
            : ""
        }
        <dateInfo>2</dateInfo>
        <dateFrom>${this.getDate().dateFrom}</dateFrom>
        <dateTo>${this.getDate().dateTo}</dateTo>
        ${checkInFrom && `<checkInFrom>${checkInFrom}</checkInFrom>`}
        ${checkInTo && `<checkInTo>${checkInTo}</checkInTo>`}
        ${status === "new" ? "<New>true</New>" : ""}
        ${status === "change" ? `<change>true</change>` : ""}
        ${status === "cancel" || status === "change" ? `<cancel>true</cancel>` : ""}
        <showConfirmed>true</showConfirmed>
        <inwork>${!status ? "true" : "false"}</inwork>
      </SearchBookings>
    </soap:Body>
  </soap:Envelope>`;
    };

    let hotelIds: number[] = [];

    if (!hotelsName?.length) {
      hotelIds = (
        await hotelModel.find({
          "integrationSettings.apiName": [integrationName],
        })
      )
        .map((hotel) => hotel._id)
        .filter((el) => el);
    } else {
      hotelIds = (
        await hotelMap.find({
          parserHotelServer: { $in: hotelsName },
        })
      ).map((hotel) => hotel._id);
    }

    if (!hotelIds.length) {
      return [];
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

    if (!fetchResponse.ok) {
      const errorText = await fetchResponse.text();
      throw new Error(`Error: ${fetchResponse.status} - ${errorText}`);
    }

    return fetchResponse;
  }
  public static deserializeXMLBooking(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    xmlBookings: any[],
    action: "new" | "change" | "cancel",
  ): IBooking[] {
    const deserializedBookings = xmlBookings
      .filter((el) => action !== "change" || el.Action[0] !== "Cancel")
      .map((el) => {
        if (action !== "change" || el.Action[0] !== "Cancel") {
          const bookingId = Number(el.BookingID[0]);
          const bookingName = el.Booking[0];
          const action = el.Action[0];
          const creationDate =
            typeof el.CreationDate[0] === "string"
              ? el.CreationDate[0]
              : undefined;
          const changeDate =
            typeof el.ChangeDate[0] === "string" ? el.ChangeDate[0] : undefined;
          const cancelDate =
            typeof el.CancelDate[0] === "string" ? el.CancelDate[0] : undefined;

          const marketId = Number(el.CustomerMarket[0].CustomerMarketId[0]);
          const marketName = el.CustomerMarket[0].CustomerMarketName[0];
          const hotelServices = el.HotelServices[0].HotelServiceInfo;
          const flights = el.Flights[0].FlightInfo;
          const flightInfo: IFlight = { flightArr: "", flightDep: "" };
          if (flights?.length > 0) {
            flightInfo.flightArr =
              flights[0].Charters[0].CharterInfo[0].Details[0].match(
                /\((.*)\)/gm,
              )[0];
            flightInfo.flightDep =
              flights[0].Charters[0].CharterInfo[1].Details[0].match(
                /\((.*)\)/gm,
              )[0];
          }
          const messages = el.Messages[0].MessageInfo;
          const messageArr: IMessage[] = [];
          if (messages?.length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            messages.map((el: any) => {
              const id = el.Id[0];
              const isOutgoing = el.IsOutgoing[0];
              const dateCreate = el.DateCreate[0];
              const isRead = el.IsRead[0];
              const text = el.Text[0];
              let messageObject: IMessage = {
                id,
                isOutgoing,
                dateCreate,
                isRead,
                text,
              };
              if (Object.hasOwn(el, "SenderName[0]")) {
                const sender = el.SenderName[0];
                messageObject = { ...messageObject, sender };
              }
              messageArr.push(messageObject);
            });
          }
          const services: IHotelServiceBooking[] = [];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          hotelServices?.map((el: any) => {
            const serviceId = Number(el.HotelServiceId[0]);
            const serviceName = el.HotelServiceName[0];
            const hotelId = Number(el.Hotel[0].HotelId[0]);
            const hotel = el.Hotel[0].HotelName[0];
            const pansion = el.Pansion[0].PansionName[0];
            const pansionId = Number(el.Pansion[0].PansionId[0]);
            const roomTypeId = Number(el.RoomType[0].RoomTypeId[0]);
            const roomType = el.RoomType[0].RoomTypeName[0];
            const roomAccommodation =
              el.RoomAccomodation[0].AccommodationName[0];
            const roomAccommodationId = Number(
              el.RoomAccomodation[0].AccommodationId[0],
            );
            const roomCategory = el.RoomCategory[0].RoomCategoryName[0];
            const roomCategoryId = Number(el.RoomCategory[0].RoomCategoryId[0]);
            const status = el.Status[0].StatusName[0];
            const checkIn = el.CheckIn[0];
            const checkOut = el.CheckOut[0];
            const confirmationNumber = Object.hasOwn(
              el,
              "HotelConfirmationNumber",
            )
              ? el.HotelConfirmationNumber[0]
              : undefined;
            const note = Object.hasOwn(el, "Notes") ? el.Notes[0] : undefined;
            const tourists = el.Tourists[0].TouristInfo;
            const costOffers = el.CostOffers[0];
            const priceRemark = Object.hasOwn(costOffers, "CostOfferInfo")
              ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                costOffers.CostOfferInfo?.map((el: any) => {
                  const str = el.CostOfferName[0];
                  const regexSPO = /spo/gi;
                  const regexEXTR = /extr/gi;
                  const regexORD = /ord/gi;
                  const regexEB = /eb/gi;

                  if (str.match(regexEXTR)) {
                    return "EXTRAS";
                  } else if (str.match(regexSPO)) {
                    return "SPO";
                  } else if (str.match(regexEB)) {
                    return "EB";
                  } else if (str.match(regexORD)) {
                    return "ORDINARY";
                  }
                }).join(",")
              : undefined;

            const touristArr: ITourist[] = [];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            tourists?.map((el: any) => {
              const name = el.Name[0];
              const birthDate =
                typeof el.BirthDate[0] === "string"
                  ? el.BirthDate[0]
                  : undefined;
              const sex = typeof el.Sex[0] === "string" ? el.Sex[0] : undefined;
              const hotelServiceId = el.HotelServiceId[0] || undefined;
              touristArr.push({ name, birthDate, sex, hotelServiceId });
            });

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const hotelServiceObject: any = {
              serviceId,
              serviceName,
              bookingCode: bookingName + "-" + serviceId,
              roomMapCode: roomTypeId + "_" + roomCategoryId,
              hotelId,
              hotel,
              pansionId,
              pansion,
              roomTypeId,
              roomType,
              roomAccommodationId,
              roomAccommodation,
              roomCategoryId,
              roomCategory,
              status,
              checkIn,
              checkOut,
              confirmationNumber,
              note,
              tourists: touristArr,
              // creationDate,
              // changeDate,
              // cancelDate,
              // marketName,
              // messages: messageArr,
              priceRemark,
            };
            services.push(hotelServiceObject);
          });
          return {
            bookingId,
            bookingName,
            action,
            creationDate,
            changeDate,
            cancelDate,
            marketId,
            marketName,
            messages: messageArr,
            flightInfo,
            hotelServices: services,
          };
        } else {
          return undefined;
        }
      })
      .filter(Boolean) as IBooking[];
    return deserializedBookings;
  }
}
