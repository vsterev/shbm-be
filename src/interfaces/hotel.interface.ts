export interface IHotel {
  _id: number;
  name: string;
  resort: string;
  code: string;
  category: string;
  regionId: number;
  resortId: number;
  parserCode?: number;
  parserName?: string;
  parserHotelServer: string;
}
