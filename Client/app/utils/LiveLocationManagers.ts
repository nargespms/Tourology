import * as Location from "expo-location";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
let currentGroupId: string | null = null;
let locationIntervalId: NodeJS.Timeout | null = null;

export const LiveLocationManager = {
  async start(groupId: string, userId: string, serverUrl: string) {
    currentGroupId = groupId;

    console.log("Starting live location sharing for group:", groupId);

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      throw new Error("Location permission not granted");
    }

    // Connect to Socket.IO
    if (!socket) {
      socket = io(serverUrl);

      socket.on("connect", () => {
        console.log("Socket connected:", socket?.id);
        socket?.emit("join", groupId);
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected");
      });
    }

    // join the group
    socket?.emit("join", groupId);

    // Start interval to send location every 10 seconds
    locationIntervalId = setInterval(async () => {
      try {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        if (socket && currentGroupId) {
          socket.emit("locationUpdate", {
            groupId: currentGroupId,
            userId,
            location: {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            },
          });
        }
      } catch (error) {
        console.error("Failed to get location:", error);
      }
    }, 5000); // every 10 seconds
  },

  async stop() {
    if (locationIntervalId) {
      clearInterval(locationIntervalId);
      locationIntervalId = null;
    }
  },

  isActive() {
    return !!socket && !!currentGroupId;
  },

  getSocket() {
    return socket;
  },
};
