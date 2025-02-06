import mongoose from "mongoose";
import User from "./User.model";
const { Schema } = mongoose;

const tourSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  paid: { type: Boolean, required: true },
  price: { type: Number, required: false },
  host: { type: User, ref: "User", required: true },
  maxGuests: { type: Number, required: false },
  startDate: { type: string, required: false },
  endDate: { type: string, required: false },
  startTime: { type: string, required: false },
  rating: { type: Number, required: false },
  reviews: {
    type: [
      {
        rating: { type: Number, required: true },
        description: { type: String, required: true },
        user: { type: User, ref: "User", required: true },
      },
    ],
    required: false,
  },
  stops: {
    type: [
      {
        name: { type: String, required: true },
        description: { type: String, required: true },
        location: { type: String, required: true },
        expectedTime: { type: string, required: false },
        description: { type: String, required: true },
        photos: { type: [String], required: false },
      },
    ],
    required: true,
  },
  photos: { type: [String], required: false },
  attendees: { type: [User], ref: "User", required: false },
  qrCode: { type: String, required: false },
});
const Tour = mongoose.model("Tour", tourSchema);
export default Tour;
