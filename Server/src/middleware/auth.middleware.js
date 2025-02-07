import jwt from "jsonwebtoken";
import { Types } from "mongoose";

const requireAuth = (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header) {
      return res.status(401).json({ message: "Missing Authorization header" });
    }

    const token = header.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user data to request
    req.user = {
      id: new Types.ObjectId(decoded.userId),
      email: decoded.email,
    };

    next();
  } catch (err) {
    console.log('err', err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default requireAuth;
