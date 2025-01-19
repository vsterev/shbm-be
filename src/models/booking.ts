import mongoose from "mongoose";
import { IBooking } from "../interfaces/booking.interface";

const bookingSchema = new mongoose.Schema(
  {
    parser: {
      //model send to parser
      send: {
        Hotel: String,
        RoomType: String,
        CheckIn: String,
        CheckOut: String,
        Booked: String,
        Voucher: String,
        RoomID: String,
        Board: String,
        Market: String,
        Remark: String,
        Status: String,
        Comments: String,
        Flight_Arr: String,
        Flight_Arr_Time: String,
        Flight_Dep: String,
        Flight_Dep_Time: String,
        Names: [{ name: String, birthDate: String }],
      },
      response: { type: Object, required: false },
      manual: {
        confirm: Object,
        deny: Object,
        required: false,
      },
    },
    bookingName: String,
    bookingId: Number,
    action: String,
    creationDate: { type: String, requred: false },
    changeDate: { type: String, requred: false },
    cancelDate: { type: String, requred: false },
    marketId: Number,
    marketName: String,
    // dateInputed: { type: Date, default: Date.now() },

    hotelService: {
      //само един сервиз от резервация
      serviceId: Number,
      serviceName: String,
      hotelId: Number,
      bookingCode: String,
      mapCode: String,
      hotel: String,
      pansionId: Number,
      pansion: String,
      roomTypeId: Number,
      roomType: String,
      roomAccommodationId: Number,
      roomAccommodation: String,
      roomCategoryId: Number,
      roomCategory: String,
      confirmationNumber: String,
      checkIn: String,
      checkOut: String,
      status: String,
      note: String,
      tourists: [
        {
          name: String,
          birthDate: String,
          sex: String,
          hotelServiceId: { type: Number, required: false },
        },
      ],
    },
    messages: [
      {
        id: Number,
        sender: { type: String, required: false },
        isRead: Boolean,
        text: String,
        isOutgoing: Boolean,
        dateCreate: String,
      },
    ],
  },
  { timestamps: true, strict: true },
);

export default mongoose.model<IBooking>("Booking", bookingSchema);
