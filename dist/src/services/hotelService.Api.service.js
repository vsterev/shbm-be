"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const envVariables_1 = __importDefault(require("../config/envVariables"));
const logger_1 = __importDefault(require("../utils/logger"));
const xml2js_1 = __importDefault(require("xml2js"));
const redis_config_1 = __importDefault(require("../config/redis.config"));
const hotelMap_1 = __importDefault(require("../models/hotelMap"));
const parser = new xml2js_1.default.Parser();
class HotelServiceAPI {
    static async retrieveToken() {
        let token = await redis_config_1.default.get("hotelServiceToken");
        if (!token) {
            token = (await this.connect()) ?? null;
        }
        if (!token) {
            throw new Error("Error retrieving token from HotelService");
        }
        return token;
    }
    static getDate() {
        const yesterday = new Date(Date.now() - 86400000);
        let dd = yesterday.getDate();
        let mm = yesterday.getMonth() + 1;
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
    static async connect() {
        const connectionStr = `<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
      <Connect xmlns="http://tempuri.org/">
        <login>${envVariables_1.default.HOTEL_SERVICE_USER}</login>
        <password>${envVariables_1.default.HOTEL_SERVICE_PASSWORD}</password>
      </Connect>
    </soap:Body>
  </soap:Envelope>`;
        try {
            const fetchResponse = await fetch(envVariables_1.default.HOTEL_SERVICE_URL, {
                method: "POST",
                body: connectionStr,
                headers: {
                    "Content-Type": "text/xml",
                },
            });
            const xmlPromise = await fetchResponse.text();
            const xml = await parser.parseStringPromise(xmlPromise);
            const token = xml["soap:Envelope"]["soap:Body"][0]["ConnectResponse"][0]["ConnectResult"][0];
            if (!token || token.includes("Invalid login or password")) {
                throw new Error("Invalid login or password");
            }
            redis_config_1.default.set("hotelServiceToken", token);
            redis_config_1.default.expire("hotelServiceToken", 3600);
            return token;
        }
        catch (error) {
            logger_1.default.error(error);
        }
    }
    static async getNewBookings(action, hotelsName) {
        const token = await this.retrieveToken();
        const requestStr = (hotelIds) => {
            const checkInFrom = "";
            const checkInTo = "";
            return `<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
      <SearchBookings xmlns="http://tempuri.org/">
        <guid>${token}</guid>
        ${hotelIds.length
                ? `<hotelID>\n${hotelIds.map((el) => `<int>${el}</int>`)}\n</hotelID>`
                : ""}
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
        try {
            let hotelIds = [];
            if (!hotelsName?.length) {
                hotelIds = (await hotelMap_1.default.find()).map((hotel) => hotel._id);
            }
            else {
                hotelIds = (await hotelMap_1.default.find({
                    parserHotelServer: { $in: hotelsName },
                })).map((hotel) => hotel._id);
            }
            const fetchResponse = await fetch(envVariables_1.default.HOTEL_SERVICE_URL, {
                method: "POST",
                body: requestStr(hotelIds),
                headers: {
                    "Content-Type": "text/xml",
                },
            });
            const xmlPromise = await fetchResponse.text();
            const xml = await parser.parseStringPromise(xmlPromise);
            const bookings = xml["soap:Envelope"]["soap:Body"][0]["SearchBookingsResponse"][0]["SearchBookingsResult"][0]["BookingInfo"];
            if (!bookings) {
                throw new Error(`No information according searching criteria`);
            }
            return bookings;
        }
        catch (error) {
            logger_1.default.error(error);
        }
    }
    static async manageBooking(serviceId, status, confirmationNumber, message) {
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
      ${confirmationNumber
            ? `<hotelConfirmationNumber>${confirmationNumber}</hotelConfirmationNumber>`
            : ""}
      ${message ? `<message>${message}</message>` : ""}
      <hotelWorkStatus>true</hotelWorkStatus>
      </ManageBooking>
      </soap:Body>
    </soap:Envelope>`;
        const fetchResponse = await fetch(envVariables_1.default.HOTEL_SERVICE_URL, {
            method: "POST",
            body: xmlString,
            headers: {
                "Content-Type": "text/xml",
            },
        });
        return fetchResponse;
    }
}
exports.default = HotelServiceAPI;
//# sourceMappingURL=hotelService.Api.service.js.map