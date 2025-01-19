import envVaraibles from "../config/envVariables";
import {
  IBooking,
  IHotelServiceBooking,
  IParserBooking,
  IParserBookingResponse,
  ITourist,
} from "../interfaces/booking.interface";
import { IHotelMap } from "../interfaces/hotelMap.interface";
import { IParsingHotelResponse } from "../interfaces/parsing.interface";
import logger from "../utils/logger";

export default class ParsingAPI {
  static async connect(): Promise<string | undefined> {
    const authStr = Buffer.from(
      envVaraibles.PARSER_USER + ":" + envVaraibles.PARSER_PASSWORD,
    ).toString("base64");
    try {
      const promiseResult = await fetch(
        `${envVaraibles.PARSER_URL}/BasicLogin`,
        {
          method: "GET",
          headers: {
            Authorization: `Basic ${authStr}`,
          },
        },
      );
      return promiseResult.json();
    } catch (error) {
      logger.error(error);
    }
  }

  static async getHotels(): Promise<IParsingHotelResponse[] | undefined> {
    try {
      const token = await this.connect();
      if (!token) {
        throw new Error("Error retrieving token from Parsersin");
      }
      const promiseResult = await fetch(
        `${envVaraibles.PARSER_URL}/GetAgentHotels`,
        {
          method: "GET",
          headers: { "Content-type": "application/json", Authorization: token },
        },
      );
      return promiseResult.json();
    } catch (error) {
      logger.error(error);
    }
  }

  static async getRooms(hotelId: number): Promise<unknown[] | undefined> {
    try {
      const promiseResult = await fetch(
        `${envVaraibles.PARSER_URL}/GetAgentHotelRoomTypes`,
        {
          method: "POST",
          body: JSON.stringify({ HotelID: hotelId }),
          headers: { "Content-type": "application/json" },
        },
      );
      return promiseResult.json();
    } catch (error) {
      logger.error(error);
    }
  }

  static async getBoards(hotelId: number): Promise<unknown[] | undefined> {
    try {
      const promiseResult = await fetch(
        `${envVaraibles.PARSER_URL}/GetAgentHotelBoards`,
        {
          method: "POST",
          body: JSON.stringify({ HotelID: hotelId }),
          headers: { "Content-type": "application/json" },
        },
      );
      return promiseResult.json();
    } catch (error) {
      logger.error(error);
    }
  }

  static async createReservation(
    booking: IParserBooking,
  ): Promise<IParserBookingResponse | undefined> {
    try {
      const token = await this.connect();
      if (!token) {
        throw new Error("Error retrieving token from Parsing");
      }
      const promiseResult = await fetch(`${envVaraibles.PARSER_URL}/NewResv`, {
        method: "POST",
        body: JSON.stringify(booking),
        headers: { "Content-type": "application/json", Authorization: token },
      });
      return promiseResult.json();
    } catch (error) {
      logger.error(error);
    }
  }

  static bookingSerialization(
    booking: IBooking,
    hts: IHotelServiceBooking,
    mapTable: IHotelMap,
  ): IParserBooking {
    const formatDate = (dt: string) => {
      if (!dt) {
        return "";
      }
      const [y, m, d] = dt.substring(0, 10).split("-");
      return `${d}.${m}.${y}`;
    };

    const formatTourists = (tourists: ITourist[]) => {
      return tourists.map((el) => {
        return {
          name: el.name,
          birthDate: el.birthDate ? formatDate(el.birthDate) : "",
        };
      });
    };
    const mapAction = {
      New: "NEW",
      Changed: "UPDATE", // mahnal sym go, zastoto poniakoga nashi nowi popadat v change - izprastam gi kato undefined
      Cancel: "CANCEL",
      InWork: "CANCEL",
    };

    return {
      Hotel: mapTable.parserHotelServer!,
      RoomType: mapTable.rooms[hts.roomMapCode].parserCode!,
      CheckIn: formatDate(hts.checkIn),
      CheckOut: formatDate(hts.checkOut),
      Booked: formatDate(booking.creationDate!),
      Voucher: hts.bookingCode,
      Board: mapTable.boards[hts.pansionId].parserCode!,
      Market: booking.marketName,
      Remark: "",
      Status: mapAction[booking.action as keyof typeof mapAction],
      Comments: hts.note ? hts.note : "",
      Names: formatTourists(hts.tourists),
      Flight_Arr: "",
      Flight_Arr_Time: "",
      Flight_Dep: "",
      Flight_Dep_Time: "",
    };
  }
  static hotelSerializationResponse = {
    Hotel: "hotelName",
    HotelID: "hotelId",
    HotelServer: "hotelServer",
    PMS_ServerID: "hotelServerId",
    ServerName: "serverName",
  };
}
