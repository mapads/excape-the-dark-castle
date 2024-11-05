// controllers/playerController.js
const { getSession, isGameStarted } = require("./gameController");

// Add player to session if conditions are met
function addPlayerToSession(sessionCode, player, socketId) {
  const session = getSession(sessionCode);

  // Ensure the session exists, has not started, and is not full
  if (!session || session.players.length >= 4 || isGameStarted(sessionCode)) {
    return { success: false, error: "Game is full, started, or session does not exist." };
  }

  // Prevent duplicate character selection
  if (session.selectedCharacters.includes(player.character)) {
    return { success: false, error: "Character is already taken." };
  }

  // Add player to the session
  session.players.push({ ...player, socketId });
  session.selectedCharacters.push(player.character);
  return { success: true, session };
}

module.exports = {
  addPlayerToSession
};