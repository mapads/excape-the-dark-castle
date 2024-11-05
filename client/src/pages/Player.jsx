// src/pages/Player.js
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import socket from "../services/socket";
import "../styles/remote.css";
import characters from "../data/characters.json";

import mainBG from "../assets/images/main_menu.jpeg";
import joinBG from "../assets/images/join_bg.png";
import abbot from "../assets/images/characters/Abbot.webp";

function Player() {
  const [name, setName] = useState("");
  const [sessionCodeInput, setSessionCodeInput] = useState("");
  const [sessionCode, setSessionCode] = useState(null);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [playerCount, setPlayerCount] = useState(0);
  const [unavailableCharacters, setUnavailableCharacters] = useState([]);
  const [error, setError] = useState("");
  const location = useLocation();

  // Retrieve session code from URL query parameters, if available
  useEffect(() => {
    const urlSessionCode = new URLSearchParams(location.search).get("code");
    if (urlSessionCode) {
      setSessionCode(urlSessionCode);
    }
  }, [location.search]);

  const handleJoinSession = () => {
    if (sessionCodeInput) {
      setSessionCode(sessionCodeInput);
    }
  };

  // Request player list when sessionCode is set
  useEffect(() => {
    if (sessionCode) {
      socket.emit("joinSession", sessionCode);
    }

    // Listen for updates to player list and game status
    socket.on("updatePlayerList", ({ players, playerCount, selectedCharacters }) => {
      setPlayerCount(playerCount);
      setUnavailableCharacters(selectedCharacters);
    });

    // Listen for join errors
    socket.on("joinError", (message) => {
      setError(message);
      setSessionCode(null);
    });

    // Clean up listeners on unmount
    return () => {
      socket.off("updatePlayerList");
      socket.off("joinError");
    };
  }, [sessionCode]);

  const handleJoinGame = () => {
    if (name && selectedCharacter) {
      socket.emit("playerJoin", { name, character: selectedCharacter.name, sessionCode });
    }
  };

  if (!sessionCode) {
    return (
      <div className="join-bg" style={{
        backgroundImage: `url(${mainBG})`,
      }}>
        <div className="join-wrapper">
          <h1 style={{marginTop:'0px'}}>Enter Game Code</h1>
          {error && <h2 style={{ color: "red", marginTop:'0px' }}>{error}</h2>}
          <input
            type="text"
            placeholder="Enter session code"
            value={sessionCodeInput}
            onChange={(e) => setSessionCodeInput(e.target.value)}
          />
          <button onClick={handleJoinSession} disabled={!sessionCodeInput}>
            Join Session
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="character-selection-bg" style={{ backgroundImage: `url(${joinBG})` }}>
      <div className="character-selection-game-text">
        <h1 style={{ marginBottom: '0px', marginTop:'5px' }}>Joining Game</h1>
        {/* <p>Session Code: {sessionCode}</p> */}
        <h2 style={{ marginTop: '0px', marginBottom:'0px' }}>Current Players: {playerCount} / 4</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

      </div>
        <h2 style={{ marginBottom: '5px', marginTop:'5px', color:'white' }}>Select Your Character</h2>
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", margin: '10px', justifyContent: 'center', overflow: 'auto' }}>
        {characters.map((character, index) => (
          <div
            key={index}
            onClick={() => {
              if (!unavailableCharacters.includes(character.name)) {
                setSelectedCharacter(character);
                setError("");
              } else {
                setError("Character is already taken.");
              }
            }}
            className="character-card"
            style={{
              // backgroundImage: `url(../assets/images/characters/${character.image})`,
              // backgroundImage: `url(../assets/images/characters/Abbot.webp)`,
              backgroundImage: `url(${abbot})`,
              border: selectedCharacter === character ? "4px solid #e4e0da" : "4px solid transparent",
              boxShadow: selectedCharacter === character ? "none" : "0px 0px 10px 5px #00000066",
              cursor: unavailableCharacters.includes(character.name) ? "not-allowed" : "pointer",
              opacity: unavailableCharacters.includes(character.name) ? 0.5 : 1,
            }}
          >
            <div className="character-information">
              <h3>{character.name}</h3>
              <p>Cunning: {character.attributes.cunning}</p>
              <p>Wisdom: {character.attributes.wisdom}</p>
              <p>Might: {character.attributes.might}</p>
            </div>
          </div>
        ))}
      </div>

      <button className="join-btn" onClick={handleJoinGame} disabled={!name || !selectedCharacter || unavailableCharacters.includes(selectedCharacter.name)}>
        Join Game
      </button>
    </div>
  );
}

export default Player;
