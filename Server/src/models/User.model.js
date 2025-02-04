import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true }, // note capitalization fix
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
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
