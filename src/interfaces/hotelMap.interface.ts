interface IBoard {
  boardId: number;
  boardName: string;
  parserCode?: string;
}

interface IRoom {
  roomTypeId: number;
  roomTypeName: string;
  roomCategoryId: number;
  roomCategoryName: string;
  parserCode?: string;
}

export interface IHotelMap {
  _id: number;
  hotelId: number;
  hotelName: string;
  hotelCode?: string;
  cityId: number;
  cityName: string;
  boards: { [key: string]: IBoard };
  rooms: { [key: string]: IRoom };
  parserCode?: number;
  parserName?: string;
  parserHotelServer?: string;
}
