import mongoose from "mongoose";

const parsingReportSchema = new mongoose.Schema(
  {
    dateInputed: { type: Date, default: Date.now() },
    parserHotels: [{ type: String }],
    ip: { type: String },
    sendedBookings: [
      {
        Hotel: { type: String, required: true },
        RoomType: { type: String, required: true },
        CheckIn: { type: String, required: true },
        CheckOut: { type: String, required: true },
        Booked: { type: String, required: true },
        Voucher: { type: String, required: true },
        Board: { type: String, required: true },
        Market: { type: String, required: true },
        Remark: { type: String, required: false },
        Status: { type: String, required: true },
        Comments: { type: String, required: false },
        Flight_Arr: { type: String, required: false },
        Flight_Arr_Time: { type: String, required: false },
        Flight_Dep: { type: String, required: false },
        Flight_Dep_Time: { type: String, required: false },
        Names: [
          {
            name: { type: String, required: true },
            birthDate: { type: String, required: false },
          },
        ],
      },
    ],
    errorMappings: [Object],
  },
  { timestamps: true, strict: true },
);

export default mongoose.model("Parser-report", parsingReportSchema);
