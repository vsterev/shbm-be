export interface IHotel {
  _id: number;
  name: string;
  resort: string;
  code: string;
  category: string;
  regionId: number;
  resortId: number;
  integrationSettings?: {
    apiName: string;
    hotelCode: string;
    [key: string]: any;
  }
}

export interface HotelResponse {
  hotelId: number;
  hotelName: string;
  settings: {
    hotelServer: string;
    hotelServerId: number;
    serverName: string;
  }
  mapped?: boolean;
}