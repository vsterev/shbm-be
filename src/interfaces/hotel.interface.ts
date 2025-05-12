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
    hotelId: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
}

export interface HotelResponse {
  hotelId: number;
  hotelName: string;
  settings: {
    // hotelServer: string;
    // hotelServerId: number;
    // serverName: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
  mapped?: boolean;
}
