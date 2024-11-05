// controllers/gameController.js
const sessions = {}; // Holds all session data

// Start a new session
function startSession(sessionCode) {
  sessions[sessionCode] = {
    players: [],
    selectedCharacters: [],
    gameStarted: false // Tracks whether the game has started
  };
  return sessions[sessionCode];
}

// Retrieve session data by code
function getSession(sessionCode) {
  if (!sessions[sessionCode]) {
    return null;
  }
  return sessions[sessionCode];
}

// Set game status to "started"
function startGame(sessionCode) {
  if (sessions[sessionCode]) {
    sessions[sessionCode].gameStarted = true;
  }
}

// Check if game has started
function isGameStarted(sessionCode) {
  return sessions[sessionCode]?.gameStarted || false;
}

// Remove player from session by socket ID
function removePlayer(sessionCode, socketId) {
  if (sessions[sessionCode]) {
    sessions[sessionCode].players = sessions[sessionCode].players.filter(
      player => player.socketId !== socketId
    );
    sessions[sessionCode].selectedCharacters = sessions[sessionCode].players.map(player => player.character);
  }
}

module.exports = {
  startSession,
  getSession,
  startGame,
  isGameStarted,
  removePlayer
};
