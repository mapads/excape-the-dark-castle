// server/server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

// Initialize express app and HTTP server
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO on the server with CORS setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Allow requests from your React client
    methods: ["GET", "POST"]
  }
});

// Handle Socket.IO connection
io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);
  
    // Host starts session and joins room
    socket.on("startSession", ({ sessionCode }) => {
      socket.join(sessionCode);
      console.log(`Host ${socket.id} started and joined room ${sessionCode}`);
    });
  
    // Player joins session
    socket.on("playerJoin", (player) => {
      const { sessionCode } = player;
      socket.join(sessionCode);
      console.log(`Socket ${socket.id} joined room ${sessionCode}`);
  
      const clientsInRoom = io.sockets.adapter.rooms.get(sessionCode);
      if (clientsInRoom) {
        console.log(`Clients in room ${sessionCode}:`, Array.from(clientsInRoom));
        io.to(sessionCode).emit("playerJoined", player);
      } else {
        console.log(`No clients found in room ${sessionCode}`);
      }
      console.log(`Player ${player.name} joined session ${sessionCode}`);
    });
  
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

// Start the server
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
