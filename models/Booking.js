const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new mongoose.Schema(
  {
    price: {
      type: String
    },
    passengers: {
      type: Number,
      default: 1
    },
    seatNumber: {
      type: String,
      required: true
    },
    boardingPoints: {
      type: String,
      required: false
    },
    
    guest: { type: Schema.Types.ObjectId, ref: "Guest" },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    owner: { type: Schema.Types.ObjectId, ref: "Owner" },
    bus: { type: Schema.Types.ObjectId, ref: "Bus" },
    self: {type: Schema.Types.ObjectId, ref: "Owner"},

    verification: {
      type: String,
      enum: ["verified", "notverified", "payed"],
      default: "notverified"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);


// example of a booking object
// {
//   "price": "500",
//   "passengers": 1,
//   "seatNumber": "A1",
//   "boardingPoints": "Nairobi",
//   "guest": "5f8d8e0d4b6e2c0017f1
//   "user": "5f8d8e0d4b6e2c0017f1",
//   "owner": "5f8d8e0d4b6e2c0017f1",
//   "bus": "5f8d8e0d4b6e2c0017f1",
//   "self": "5f8d8e0d4b6e2c0017f1",
// }
