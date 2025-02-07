import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

const register = async (req, res) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      languages,
      skills,
      yearsOfExperience = 0,
      phoneNumber,
      role,
      profileName,
      bio,
    } = req.body;

    let profilePicturePath = "";

    if (req.file) {
      profilePicturePath = req.file.filename;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    //  Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    //  Create new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNumber,
      role,
      profileName,
      profilePicture: profilePicturePath,
      bio,
      languages: languages?.split(',').map((lang) => lang.trim().toLowerCase()),
      skills: skills?.split(',').map((exp) => exp.trim().toLowerCase()),
      yearsOfExperience: parseInt(yearsOfExperience, 10) || 0,
    });

    await newUser.save();

    // create a jwt token and send it in the response
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token, userId: newUser._id,
      email: newUser.email,
      role: newUser.role,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      profileName: newUser.profileName,
      profilePicture: newUser.profilePicture,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Sign JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      userId: user._id,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profileName: user.profileName,
      profilePicture: user.profilePicture,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export default {
  register,
  login,
};
