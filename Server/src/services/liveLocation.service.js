import { Server } from "socket.io";

/**
 * This service uses socket.io to share the live location of multiple users separated in groups.
 * It allows users to join groups and share their location with other group members.
 */

class LiveLocationService {
  io = null; // Socket.io instance
  groups = null; // Map<groupId, Set<socketId>>

  constructor() {
    this.groups = new Map();

    this.io = new Server({
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    this.io.listen(process.env.SOCKET_PORT || 4001, () => {
      console.log(
        `Socket.io server running on port ${process.env.SOCKET_PORT || 4001}`
      );
    });

    this.io.on("connection", (socket) => {
      console.log(`Socket connected: ${socket.id}`);

      socket.on("join", (groupId) => this.joinGroup(socket, groupId));
      socket.on("leave", (groupId) => this.leaveGroup(socket, groupId));
      socket.on("locationUpdate", (payload) =>
        this.updateLocation(socket, payload)
      );
      socket.on("disconnect", () => this.handleDisconnect(socket));
      socket.on("error", (err) => console.error("Socket error:", err));
    });
  }

  joinGroup(socket, groupId) {
    socket.join(groupId);

    if (!this.groups.has(groupId)) {
      this.groups.set(groupId, new Set());
    }

    this.groups.get(groupId).add(socket.id);
    console.log(`Socket ${socket.id} joined group ${groupId}`);
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

    console.log(`Socket ${socket.id} left group ${groupId}`);
  }

  handleDisconnect(socket) {
    for (const [groupId, members] of this.groups.entries()) {
      if (members.has(socket.id)) {
        this.leaveGroup(socket, groupId);
      }
    }

    console.log(`Socket disconnected: ${socket.id}`);
  }

  updateLocation(socket, { groupId, location }) {
    if (this.groups.has(groupId)) {
      this.io.to(groupId).emit("locationUpdate", {
        socketId: socket.id,
        location,
      });

      console.log(`Socket ${socket.id} updated location in group ${groupId}`);
    }
  }

  getGroupMembers(groupId) {
    return this.groups.get(groupId) || new Set();
  }

  getGroupIdBySocket(socketId) {
    for (const [groupId, sockets] of this.groups.entries()) {
      if (sockets.has(socketId)) {
        return groupId;
      }
    }
    return null;
  }

  getSocketById(socketId) {
    return this.io?.sockets?.sockets?.get(socketId);
  }

  getGroupById(groupId) {
    return this.groups.get(groupId);
  }

  getIo() {
    return this.io;
  }

  getGroups() {
    return this.groups;
  }
}

const liveLocationService = new LiveLocationService();
export default liveLocationService;
