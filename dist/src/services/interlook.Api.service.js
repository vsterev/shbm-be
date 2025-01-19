"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const envVariables_1 = __importDefault(require("../config/envVariables"));
const xml2js_1 = __importDefault(require("xml2js"));
const redis_config_1 = __importDefault(require("../config/redis.config"));
const logger_1 = __importDefault(require("../utils/logger"));
const hotelMap_1 = __importDefault(require("../models/hotelMap"));
/* eslint-disable @typescript-eslint/no-explicit-any */
const parser = new xml2js_1.default.Parser();
class InterlookServiceAPI {
    static async connect() {
        const connectionStr = `<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <Connect xmlns="http://www.megatec.ru/">
      <login>${envVariables_1.default.INTERLOOK_USER}</login>
      <password>${envVariables_1.default.INTERLOOK_PASSWORD}</password>

    </Connect>
  </soap:Body>
</soap:Envelope>`;
        try {
            const fetchResponse = await fetch(envVariables_1.default.INTERLOOK_URL, {
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
            redis_config_1.default.set("interlookToken", token);
            redis_config_1.default.expire("interlookToken", 3600);
            return token;
        }
        catch (error) {
            logger_1.default.error(error);
        }
    }
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
    static async getHotels() {
        const requestStr = `<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetHotels xmlns="http://www.megatec.ru/">
      <countryKey>4</countryKey>
      <regionKey>-1</regionKey>
      <cityKey>-1</cityKey>
    </GetHotels>
  </soap:Body>
</soap:Envelope>`;
        const interlookHotelsResponse = await fetch(envVariables_1.default.INTERLOOK_URL, {
            method: "post",
            body: requestStr,
            headers: {
                "Content-Type": "text/xml",
            },
        });
        const interlookHotelsResponseText = await interlookHotelsResponse.text();
        const interLookHotelsXML = await parser.parseStringPromise(interlookHotelsResponseText);
        const interLookHotels = interLookHotelsXML["soap:Envelope"]["soap:Body"][0]["GetHotelsResponse"][0]["GetHotelsResult"][0]["Hotel"];
        const hotelJson = interLookHotels.map((hotel) => {
            return {
                _id: +hotel.ID[0],
                name: hotel.Name[0],
                code: hotel.Code[0],
                resort: hotel.City[0].Name[0],
                category: hotel.HotelCategoryID[0],
                regionId: +hotel.RegionID[0],
                resortId: +hotel.CityID[0],
            };
        });
        return hotelJson;
    }
    static async getCities() {
        const requestStr = `
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
      <GetCities xmlns="http://www.megatec.ru/">
        <countryKey>4</countryKey>
        <regionKey>-1</regionKey>
      </GetCities>
    </soap:Body>
  </soap:Envelope>`;
        const interlookCitiesResponse = await fetch(envVariables_1.default.INTERLOOK_URL, {
            method: "post",
            body: requestStr,
            headers: {
                "Content-Type": "text/xml",
            },
        });
        const interlookCitiesResponseText = await interlookCitiesResponse.text();
        const interLookCitiesXML = await parser.parseStringPromise(interlookCitiesResponseText);
        const InterlookCities = interLookCitiesXML["soap:Envelope"]["soap:Body"][0]["GetRoomCategoriesResponse"][0]["GetRoomCategoriesResult"][0]["RoomCategory"];
        const citiesJson = InterlookCities.map((city) => {
            return {
                _id: +city.ID[0],
                name: city.Name[0],
                regionId: +city.RegionID[0],
                countryId: +city.CountryID[0],
                code: city.Code[0],
            };
        });
        return citiesJson;
    }
    static async getRoomCategories() {
        const requestStr = `<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
<soap:Body>
  <GetRoomCategories xmlns="http://www.megatec.ru/" />
</soap:Body>
</soap:Envelope>`;
        const interlookRoomCateriesResponse = await fetch(envVariables_1.default.INTERLOOK_URL, {
            method: "post",
            body: requestStr,
            headers: {
                "Content-Type": "text/xml",
            },
        });
        const interlookRoomCategoriesResponseText = await interlookRoomCateriesResponse.text();
        const roomCategoriesXML = await parser.parseStringPromise(interlookRoomCategoriesResponseText);
        const interlookRoomCategories = roomCategoriesXML["soap:Envelope"]["soap:Body"][0]["GetRoomCategoriesResponse"][0]["GetRoomCategoriesResult"][0]["RoomCategory"];
        const roomCategoriesJson = interlookRoomCategories.map((roomCategory) => {
            return {
                _id: +roomCategory.ID[0],
                name: roomCategory.Name[0],
                code: roomCategory.Code[0],
                mainPlaces: +roomCategory.MainPlaces[0],
                extraPlaces: +roomCategory.ExtraPlaces[0],
            };
        });
        return roomCategoriesJson;
    }
    static async getRoomTypes() {
        const requestStr = `<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
<soap:Body>
  <GetRoomType xmlns="http://www.megatec.ru/" />
</soap:Body>
</soap:Envelope>`;
        const interlookRoomTypesResponse = await fetch(envVariables_1.default.INTERLOOK_URL, {
            method: "post",
            body: requestStr,
            headers: {
                "Content-Type": "text/xml",
            },
        });
        const interlookRoomTypesResponseText = await interlookRoomTypesResponse.text();
        const roomTypesXML = await parser.parseStringPromise(interlookRoomTypesResponseText);
        const interlookRoomTypes = roomTypesXML["soap:Envelope"]["soap:Body"][0]["GetRoomTypeResponse"][0]["GetRoomTypeResult"][0]["RoomType"];
        const roomTypesJson = interlookRoomTypes.map((roomType) => {
            return {
                _id: +roomType.ID[0],
                name: roomType.Name[0],
                code: roomType.Code[0],
                description: roomType.Description[0],
                places: +roomType.Places[0],
                explaces: +roomType.ExPlaces[0],
            };
        });
        return roomTypesJson;
    }
    static async getBoards() {
        const requestStr = `
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetPansions xmlns="http://www.megatec.ru/" />
  </soap:Body>
</soap:Envelope>`;
        const interlookBoardsResponse = await fetch(envVariables_1.default.INTERLOOK_URL, {
            method: "post",
            body: requestStr,
            headers: {
                "Content-Type": "text/xml",
            },
        });
        const interlookBoardText = await interlookBoardsResponse.text();
        const boardXML = await parser.parseStringPromise(interlookBoardText);
        const interlookBoards = boardXML["soap:Envelope"]["soap:Body"][0]["GetPansionsResponse"][0]["GetPansionsResult"][0]["Pansion"];
        const boardsJson = interlookBoards.map((board) => {
            return {
                _id: +board.ID[0],
                name: board.Name[0],
                code: board.Code[0],
            };
        });
        return boardsJson;
    }
    static async getCalculationVariants(hotel, checkIn, checkOut) {
        const requestStr = `
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
  <SearchActualCostCalculationVariant xmlns="http://www.megatec.ru/">
    <guid>${this.retrieveToken()}</guid>
    <request HotelId="${hotel._id}" DateFrom="${checkIn}" DateTo="${checkOut}" ValidateQuota="false" CheckAdHot="false" Rate="EU"/>
  </SearchActualCostCalculationVariant>
  </soap:Body>
  </soap:Envelope>`;
        const interlookCalculationVariantsResponse = await fetch(envVariables_1.default.INTERLOOK_URL, {
            method: "post",
            body: requestStr,
            headers: {
                "Content-Type": "text/xml",
            },
        });
        const interlookCalculationVariantsText = await interlookCalculationVariantsResponse.text();
        const calculationVariantsXML = await parser.parseStringPromise(interlookCalculationVariantsText);
        const interlookCalculationVariants = calculationVariantsXML["soap:Envelope"]["soap:Body"][0]["SearchActualCostCalculationVariantResponse"][0]["SearchActualCostCalculationVariantResult"][0]["Data"][0]["CostCalculationVariant"];
        const parserCode = hotel.parserCode;
        const parserName = hotel.parserName;
        const parserHotelServer = hotel.parserHotelServer;
        const hotelName = hotel.name;
        const hotelCode = hotel.code;
        const cityId = +hotel.resortId;
        const cityName = hotel.resort;
        const obj = {};
        const boardObj = {};
        interlookCalculationVariants.forEach(async (variant) => {
            const roomTypeId = +variant.RoomTypeId[0];
            const roomTypeName = variant.RoomTypeName[0];
            const roomCategoryId = +variant.RoomCategoryId[0];
            const roomCategoryName = variant.RoomCategoryName[0];
            const boardId = variant.PansionId[0];
            const boardName = variant.PansionName[0];
            if (!Object.hasOwn(obj, roomTypeId + "_" + roomCategoryId)) {
                obj[roomTypeId + "_" + roomCategoryId] = {};
            }
            obj[roomTypeId + "_" + roomCategoryId] = {
                roomTypeId,
                roomTypeName,
                roomCategoryId,
                roomCategoryName,
            };
            if (!Object.hasOwn(boardObj, boardId)) {
                boardObj[boardId] = { boardId: +boardId, boardName };
            }
            await hotelMap_1.default.create({
                _id: +hotel._id,
                rooms: obj,
                boards: boardObj,
                hotelName,
                hotelId: +hotel._id,
                hotelCode,
                cityId,
                cityName,
                parserCode,
                parserName,
                parserHotelServer,
            });
        });
    }
}
exports.default = InterlookServiceAPI;
//# sourceMappingURL=interlook.Api.service.js.map