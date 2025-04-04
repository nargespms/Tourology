import { io } from "socket.io-client";

const socket = io("http://172.16.1.59:4001");

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
