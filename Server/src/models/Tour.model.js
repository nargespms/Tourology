import mongoose, { Types } from "mongoose";
import User from "./User.model.js";
const { Schema } = mongoose;

const tourSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    region: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    paid: { type: Boolean, required: true },
    price: { type: Number, required: false },
    state: { type: String, required: true },
    category: { type: [String], default: [], required: true },
    host: {
      type: {
        id: { type: Types.ObjectId, required: true },
        name: { type: String, required: true },
      },
      required: true,
    },
    maxAttendees: { type: Number, required: false },
    startDate: { type: String, required: false },
    endDate: { type: String, required: false },
    createdAt: { type: Date, required: true, default: Date.now },
    rating: { type: Number, required: false },
    reviews: {
      type: Map,
      of: {
        date: { type: Date, required: true },
        id: { type: String, required: true },
        rating: { type: Number, required: true },
        description: { type: String, required: true },
        user: {
          id: { type: Types.ObjectId, required: true },
          name: { type: String, required: true },
        },
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
            type: String,
            enum: ["Point"],
            required: true,
            default: "Point",
          },
          coordinates: {
            type: [Number],
            required: true,
          },
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
        phoneNumber: { type: String, required: false },
        checkedIn: { type: Boolean, required: true },
        checkedInDate: { type: Date, required: false },
      },
      required: false,
    },
  },
  {
    autoIndex: true,
  }
);

// Text index for name and description
tourSchema.index({
  name: "text",
  description: "text",
});

// Separate 2dsphere index for geospatial queries on region
tourSchema.index({ region: "2dsphere" });

const Tour = mongoose.model("Tour", tourSchema);
export default Tour;
