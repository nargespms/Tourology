import mongoose, { Types } from "mongoose";
import User from "./User.model.js";
const { Schema } = mongoose;

const tourSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  region: {
    type: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    required: true
  },
  paid: { type: Boolean, required: true },
  price: { type: Number, required: false },
  state: { type: String, required: true },
  host: {
    type: {
      id: { type: Types.ObjectId, required: true },
      name: { type: String, required: true },
    },
    required: true
  },
  maxAttendees: { type: Number, required: false },
  startDate: { type: String, required: false },
  endDate: { type: String, required: false },
  rating: { type: Number, required: false },
  reviews: {
    type: Map,
    of: {
      date: { type: Date, required: true },
      id: { type: String, required: true },
      rating: { type: Number, required: true },
      description: { type: String, required: true },
      userId: { type: Types.ObjectId, required: true },
    },
    required: false,
  },
  stops: {
    type: Map,
    of: {
      id: { type: String, required: true },
      name: { type: String, required: true },
      description: { type: String, required: true },
      location: { type: String, required: true },
      region: {
        type: {
          latitude: { type: Number, required: true },
          longitude: { type: Number, required: true },
        },
        required: true
      },
      time: { type: String, required: false },
      photo: { type: String, required: false },
    },
    required: true,
  },
  photos: { type: [String], required: false },
  attendees: {
    type: Map,
    of: {
      id: { type: Types.ObjectId, required: true },
      name: { type: String, required: true },
      phone: { type: String, required: false },
      checkedIn: { type: Boolean, required: true },
    },
    required: false,
  },
});
const Tour = mongoose.model("Tour", tourSchema);
export default Tour;
