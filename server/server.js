// server/server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { startSession, getSession, startGame, removePlayer } = require("./controllers/gameController");
const { addPlayerToSession } = require("./controllers/playerController");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  let sessionCode = null;

  // Host starts a session and joins the room
  socket.on("startSession", ({ sessionCode: code }) => {
    sessionCode = code;
    socket.join(sessionCode);

    const session = startSession(sessionCode);
    console.log(`Host ${socket.id} started and joined room ${sessionCode}`);

    // Send initial player list to the host
    io.to(sessionCode).emit("updatePlayerList", {
      players: session.players,
      playerCount: session.players.length,
      selectedCharacters: session.selectedCharacters
    });

    console.log(`initial player list sent to host ${{
      players: session.players,
      playerCount: session.players.length,
      selectedCharacters: session.selectedCharacters
    }.toString()}`);
  });

  // Send current player list to new player when they request it
  socket.on("joinSession", (code) => {
    const session = getSession(code);
    if (session) {
      socket.emit("updatePlayerList", {
        players: session.players,
        playerCount: session.players.length,
        selectedCharacters: session.selectedCharacters
      });
      console.log(`Player list sent to player ${socket.id}`);
    } else {
      socket.emit("joinError", "Session does not exist.");
    }
  });

  // Player joins session
  socket.on("playerJoin", (player) => {
    const { name, character, sessionCode: code } = player;
    sessionCode = code;

    const { success, error, session } = addPlayerToSession(sessionCode, player, socket.id);
    console.log(`Player ${name} with character ${character} attempting to join session ${sessionCode}`);
    
    if (!success) {
      socket.emit("joinError", error);
      console.log(`Player ${name} with character ${character} failed to join session ${sessionCode} due to ${error}`);
      return;
    }

    socket.join(sessionCode);
    console.log(`Player ${name} with character ${character} successfully joined session ${sessionCode}`);

    // Send updated player list to the joining player only
    socket.emit("updatePlayerList", {
      players: session.players,
      playerCount: session.players.length,
      selectedCharacters: session.selectedCharacters
    });
    console.log(`Player list sent to player ${socket.id}`);

    // Broadcast updated player list to everyone in the room, including host
    io.to(sessionCode).emit("updatePlayerList", {
      players: session.players,
      playerCount: session.players.length,
      selectedCharacters: session.selectedCharacters
    });

    console.log(`BROADCAST: Player ${name} with character ${character} joined session ${sessionCode}`);
  });

  // Handle client disconnection
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    if (sessionCode) {
      removePlayer(sessionCode, socket.id);
      const session = getSession(sessionCode);

      console.log(`Player ${socket.id} disconnected from session ${sessionCode}`);

      io.to(sessionCode).emit("updatePlayerList", {
        players: session.players,
        playerCount: session.players.length,
        selectedCharacters: session.selectedCharacters
      });

      console.log(`Updated player list sent to room ${sessionCode}: ${{
        players: session.players,
        playerCount: session.players.length,
        selectedCharacters: session.selectedCharacters
      }.toString()}`);
    }
  });
});



// Start the server
const PORT = 5001;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
