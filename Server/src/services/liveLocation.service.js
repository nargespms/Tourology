import { Server } from "socket.io";

/**
 * This service uses socket.io to share the live location of multiple users separated in groups.
 * It allows users to join groups and share their location with other group members.
 */

class LiveLocationService {
  io = null;
  groups = new Map();

  setup(httpServer) {
    if (!httpServer) {
      throw new Error("❗ setup() requires an HTTP server.");
    }

    this.io = new Server(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    this.io.on("connection", (socket) => {
      socket.on("join", (groupId) => this.joinGroup(socket, groupId));
      socket.on("leave", (groupId) => this.leaveGroup(socket, groupId));
      socket.on("locationUpdate", (payload) =>
        this.updateLocation(socket, payload)
      );
      socket.on("disconnect", () => this.handleDisconnect(socket));
    });
  }

  joinGroup(socket, groupId) {
    socket.join(groupId);

    if (!this.groups.has(groupId)) {
      this.groups.set(groupId, new Set());
    }

    this.groups.get(groupId).add(socket.id);
  }

  leaveGroup(socket, groupId) {
    socket.leave(groupId);

    if (this.groups.has(groupId)) {
      const members = this.groups.get(groupId);
      members.delete(socket.id);

      if (members.size === 0) {
        this.groups.delete(groupId);
      }
    }
  }

  handleDisconnect(socket) {
    for (const [groupId, members] of this.groups.entries()) {
      if (members.has(socket.id)) {
        this.leaveGroup(socket, groupId);
      }
    }
  }

  updateLocation(socket, { groupId, location, userId }) {
    if (!this.groups.has(groupId)) {
      this.joinGroup(socket, groupId);
    }

    this.io.to(groupId).emit("locationUpdate", {
      socketId: socket.id,
      location,
      userId,
    });
  }
}

const liveLocationService = new LiveLocationService();
export default liveLocationService;
