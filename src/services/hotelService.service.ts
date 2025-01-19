import {
  IBooking,
  IFlight,
  IHotelServiceBooking,
  IMessage,
  ITourist,
} from "../interfaces/booking.interface";
export default class HotelService {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  public static deserializeXMLBooking(
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
              ? costOffers.CostOfferInfo?.map((el: any) => {
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
            // console.log(action, aaction, bookingName, serviceName)

            const hotelServiceObject: IHotelServiceBooking = {
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
            hotelServices: services,
            messages: messageArr,
            flightInfo,
          };
        } else {
          return undefined;
        }
      })
      .filter(Boolean) as IBooking[];
    return deserializedBookings;
  }
}
