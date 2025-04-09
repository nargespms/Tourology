import mongoose, { Types } from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },

    role: { type: String, default: "traveler" },

    profileName: { type: String, default: "" },
    profilePicture: { type: String, optional: true },
    bio: { type: String, default: "" },

    // for tour guide
    languages: { type: [String], default: [], optional: true },
    skills: { type: [String], default: [], optional: true },
    yearsOfExperience: { type: Number, default: 0, optional: true },
    tours: { type: [Types.ObjectId], default: [], optional: true },
    numberOfFollowers: { type: Number, default: 0, optional: true },

    // for traveler
    favoriteTours: { type: [Types.ObjectId], default: [], optional: true }, // id of the ours
    followingGuides: { type: [Types.ObjectId], default: [], optional: true }, // id of the guides
    bookedTours: { type: [Types.ObjectId], default: [], optional: true }, // id of the tours
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
