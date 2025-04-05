import { io } from "socket.io-client";

const socket = io("http://49.13.114.192:4000");

socket.on("connect", () => {
  console.log("✅ Connected:", socket.id);
  socket.emit("join", "group-abc");
});

socket.on("locationUpdate", (data) => {
  console.log("📍 Location update received:", data);
});

socket.on("connect_error", (err) => {
  console.error("❌ Connection error:", err);
});
