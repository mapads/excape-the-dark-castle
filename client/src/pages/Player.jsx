// src/pages/Player.js
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import socket from "../services/socket";

function Player() {
  const [name, setName] = useState("");
  const [character, setCharacter] = useState("");
  const location = useLocation();
  const sessionCode = new URLSearchParams(location.search).get("code");

  const handleJoin = () => {
    if (name && character) {
      // Emit playerJoined event with player details
      socket.emit("playerJoin", { name, character, sessionCode });
    }
  };

  return (
    <div>
      <h1>Join Game</h1>
      <p>Session Code: {sessionCode}</p>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <select value={character} onChange={(e) => setCharacter(e.target.value)}>
        <option value="">Choose Character</option>
        <option value="Warrior">Warrior</option>
        <option value="Mage">Mage</option>
        <option value="Rogue">Rogue</option>
      </select>
      <button onClick={handleJoin}>Join Game</button>
    </div>
  );
}

export default Player;