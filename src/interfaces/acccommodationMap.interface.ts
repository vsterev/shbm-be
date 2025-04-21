export interface IBoard {
  boardId: number;
  boardName: string;
  parserCode?: string;
  // integrations?: {
  //   [integrationCode: string]: string;
  // }
}

export interface IRoom {
  roomTypeId: number;
  roomTypeName: string;
  roomCategoryId: number;
  roomCategoryName: string;
  parserCode?: string;
  // integrations?: {
  //   [integrationCode: string]: string;
  // }
}

export interface IAccommodationMap {
  _id: number;
  hotelName: string;
  boards: { [key: string]: IBoard };
  rooms: { [key: string]: IRoom };
}
