import mongoose from "mongoose";
import { IBooking } from "../interfaces/booking.interface";

const bookingSchema = new mongoose.Schema(
  {
    log: {
      type: new mongoose.Schema(
        {
          sendDate: { type: Date, required: false },
          send: { type: mongoose.Schema.Types.Mixed, required: false },
          response: { type: mongoose.Schema.Types.Mixed, required: false },
          manual: { type: Map, of: new mongoose.Schema({ bookingNumber: String, message: String }), required: false },
        },
        { _id: false }
      ),
      required: false,
    },
    bookingName: String,
    bookingId: Number,
    action: String,
    creationDate: { type: String, requred: false },
    changeDate: { type: String, requred: false },
    cancelDate: { type: String, requred: false },
    marketId: Number,
    marketName: String,
    // dateInputed: { type: Date, default: Date.now() }, get information from log.sendDate;

    hotelServices: [
      {
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
    ],
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
