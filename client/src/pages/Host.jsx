// src/pages/Host.js
import React, { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import socket from "../services/socket";

function Host() {
  const [sessionCode, setSessionCode] = useState("");
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    // Generate session code when component mounts
    const generatedCode = Math.floor(1000 + Math.random() * 9000).toString();
    setSessionCode(generatedCode);

    // Emit start session and join room on the server
    socket.emit("startSession", { sessionCode: generatedCode });
  }, []);

  // Listen for player join events and update players list
  useEffect(() => {
    socket.on("playerJoined", (player) => {
      console.log("Player joined event received:", player); // Check if this logs
      setPlayers((prevPlayers) => [...prevPlayers, player]);
    });

    return () => {
      socket.off("playerJoined");
    };
  }, []);

  return (
    <div>
      <h1>Host Screen</h1>
      <h2>Session Code: {sessionCode}</h2>
      <QRCodeCanvas value={`http://localhost:3000/join?code=${sessionCode}`} />
      
      <h3>Players Joined:</h3>
      <ul>
        {players.map((player, index) => (
          <li key={index}>{player.name} - {player.character}</li>
        ))}
      </ul>
    </div>
  );
}

export default Host;
