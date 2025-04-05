import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http"; // ✅ NEW
import connectDB from "./config/db.js";
import routes from "./routes/index.js";
import liveLocationService from "./services/liveLocation.service.js";

dotenv.config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use("/api", routes);

const PORT = process.env.PORT || 4000;

// Create and start HTTP server
const server = http.createServer(app);

// Setup Socket.IO on top of Express HTTP server
liveLocationService.setup(server);

server.listen(PORT, () => {
  console.log(`🚀 Server (Express + Socket.IO) running on port ${PORT}`);
});
