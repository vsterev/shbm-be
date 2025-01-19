"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const envVariables_1 = __importDefault(require("../config/envVariables"));
const logger_1 = __importDefault(require("../utils/logger"));
class ParsingAPI {
    static async connect() {
        const authStr = Buffer.from(envVariables_1.default.PARSER_USER + ":" + envVariables_1.default.PARSER_PASSWORD).toString("base64");
        try {
            const promiseResult = await fetch(`${envVariables_1.default.PARSER_URL}/BasicLogin`, {
                method: "GET",
                headers: {
                    Authorization: `Basic ${authStr}`,
                },
            });
            return promiseResult.json();
        }
        catch (error) {
            logger_1.default.error(error);
        }
    }
    static async getHotels() {
        try {
            const token = await this.connect();
            if (!token) {
                throw new Error("Error retrieving token from Parsersin");
            }
            const promiseResult = await fetch(`${envVariables_1.default.PARSER_URL}/GetAgentHotels`, {
                method: "GET",
                headers: { "Content-type": "application/json", Authorization: token },
            });
            return promiseResult.json();
        }
        catch (error) {
            logger_1.default.error(error);
        }
    }
    static async getRooms(hotelId) {
        try {
            const promiseResult = await fetch(`${envVariables_1.default.PARSER_URL}/GetAgentHotelRoomTypes`, {
                method: "POST",
                body: JSON.stringify({ HotelID: hotelId }),
                headers: { "Content-type": "application/json" },
            });
            return promiseResult.json();
        }
        catch (error) {
            logger_1.default.error(error);
        }
    }
    static async getBoards(hotelId) {
        try {
            const promiseResult = await fetch(`${envVariables_1.default.PARSER_URL}/GetAgentHotelBoards`, {
                method: "POST",
                body: JSON.stringify({ HotelID: hotelId }),
                headers: { "Content-type": "application/json" },
            });
            return promiseResult.json();
        }
        catch (error) {
            logger_1.default.error(error);
        }
    }
    static async createReservation(booking) {
        try {
            const token = await this.connect();
            if (!token) {
                throw new Error("Error retrieving token from Parsing");
            }
            const promiseResult = await fetch(`${envVariables_1.default.PARSER_URL}/NewResv`, {
                method: "POST",
                body: JSON.stringify(booking),
                headers: { "Content-type": "application/json", Authorization: token },
            });
            return promiseResult.json();
        }
        catch (error) {
            logger_1.default.error(error);
        }
    }
    static bookingSerialization(booking, hts, mapTable) {
        const formatDate = (dt) => {
            if (!dt) {
                return "";
            }
            const [y, m, d] = dt.substring(0, 10).split("-");
            return `${d}.${m}.${y}`;
        };
        const formatTourists = (tourists) => {
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
            Hotel: mapTable.parserHotelServer,
            RoomType: mapTable.rooms[hts.roomMapCode].parserCode,
            CheckIn: formatDate(hts.checkIn),
            CheckOut: formatDate(hts.checkOut),
            Booked: formatDate(booking.creationDate),
            Voucher: hts.bookingCode,
            Board: mapTable.boards[hts.pansionId].parserCode,
            Market: booking.marketName,
            Remark: "",
            Status: mapAction[booking.action],
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
exports.default = ParsingAPI;
//# sourceMappingURL=parsing.Api.service.js.map