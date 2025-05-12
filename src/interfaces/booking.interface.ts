export interface IParserBooking {
  Hotel: string;
  RoomType: string;
  CheckIn: string;
  CheckOut: string;
  Booked: string;
  Voucher: string;
  Board: string;
  Market: string;
  Remark?: string;
  Status: string;
  Comments?: string;
  Flight_Arr?: string;
  Flight_Arr_Time?: string;
  Flight_Dep?: string;
  Flight_Dep_Time?: string;
  Names: {
    name: string;
    birthDate?: string;
  }[];
}
export interface IParserBookingResponse {
  Adults: number;
  Age1: number;
  Age2?: number;
  Age3?: number;
  Age4?: number;
  Age5?: number;
  Age6?: number;
  Age7?: number;
  Board: string;
  CheckIn: string;
  CheckOut: string;
  Children: number;
  ConfirmationNo: string;
  Hotel: string;
  Name1: string;
  Name2?: string;
  Name3?: string;
  Name4?: string;
  Name5?: string;
  Name6?: string;
  Name7?: string;
  PriceAmount: number;
  PriceCurrency: string;
  ResponseText: string;
  ResvID: number;
  RoomType: string;
  Vocher: string;
  isCancelled: string;
}
export interface IMessage {
  id: string;
  sender?: string;
  isRead: boolean;
  text: string;
  isOutgoing: boolean;
  dateCreate: string;
}
export interface ITourist {
  name: string;
  birthDate?: string;
  sex?: string;
  hotelServiceId?: number;
}

export interface ICostOffersInfo {
  costOfferName: string;
  costOfferDuration: number;
  costOfferDateBegin: string;
  costOfferDateEnd: string;
}
export interface IHotelServiceBooking {
  serviceId: number;
  serviceName: string;
  bookingCode: string;
  hotelId: number;
  hotel: string;
  pansionId: number;
  pansion: string;
  roomTypeId: number;
  roomType: string;
  roomMapCode: string;
  roomAccommodationId: number;
  roomAccommodation: string;
  roomCategoryId: number;
  roomCategory: string;
  confirmationNumber?: string;
  checkIn: string;
  checkOut: string;
  status: string;
  note?: string;
  tourists: ITourist[];
  priceRemark?: string;
  costOffersInfo: ICostOffersInfo[];
  log?: {
    sendDate?: Date;
    // esplicit any type is used here to allow for flexibility in the data structure
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    send: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    response: any;
    manual?: {
      [key: string]: {
        bookingNumber: string;
        message: string;
        confirmationNumber?: string;
      };
    };
    integrationStatus?: "wait" | "confirmed" | "denied" | "cancelled";
    integrationId: string;
  };
}
export interface IFlight {
  flightArr: string;
  flightDep: string;
}

export interface IBooking {
  _id?: string;
  bookingName: string;
  bookingId: number;
  action: string;
  creationDate?: string;
  cancelDate?: string;
  changeDate?: string;
  marketId: number;
  marketName: string;
  messages: IMessage[];
  hotelServices: IHotelServiceBooking[];
  flightInfo?: IFlight;
  dateInputed?: Date;
}

export type IBookingHotelServicePrepared = IHotelServiceBooking & {
  roomIntegrationCode?: string;
  boardIntegrationCode?: string;
  integrationSettings?: {
    apiName: string;
    hotelId: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
};

export type IBookingPrepared = IBooking & {
  hotelServices: IBookingHotelServicePrepared[];
};

export type IBookingHotelServiceProxyResponse = IBookingHotelServicePrepared & {
  msgConfirmation?: string;
};

export type IBookingResponse = IBooking & {
  hotelServices: IBookingHotelServiceProxyResponse[];
};
