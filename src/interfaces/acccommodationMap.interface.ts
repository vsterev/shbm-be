export interface IBoard {
  _id?: string;
  boardId: number;
  boardName: string;
  integrationCode?: string;
}

export interface IRoom {
  _id?: string;
  roomTypeId: number;
  roomTypeName: string;
  roomCategoryId: number;
  roomCategoryName?: string;
  integrationCode?: string;
}

export interface IAccommodationMap {
  _id: number;
  hotelName: string;
  integrationName: string;
  boards: { [key: string]: IBoard };
  rooms: { [key: string]: IRoom };
}
