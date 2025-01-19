import { IParserBooking } from "./booking.interface";
/* eslint-disable @typescript-eslint/no-explicit-any */

export interface IParserReport {
  dateInputed: Date;
  parserHotels: string[];
  ip: string;
  sendedBookings: IParserBooking[];
  errorMappings?: { [key: string]: any }[];
}
