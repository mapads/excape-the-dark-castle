// src/pages/Host.js
import React, { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import socket from "../services/socket";

import "../styles/main.css";

import mainBG from "../assets/images/main_menu.jpeg";

import abbot from '../assets/images/characters/Abbot.webp';

function Host() {
  const [sessionCode, setSessionCode] = useState("");
  const [players, setPlayers] = useState([]);
  const [playerCount, setPlayerCount] = useState(0);

  // Listen for player list updates
  useEffect(() => {
    socket.on("updatePlayerList", ({ players, playerCount, selectedCharacters }) => {
      setPlayers(players);
      setPlayerCount(playerCount);
    });

    socket.on("gameStarted", () => {
      console.log("Game started!");
    });

    // Clean up listener on unmount
    return () => {
      socket.off("updatePlayerList");
      socket.off("gameStarted");
    };
  }, []);


  const startGame = () => {
    const generatedCode = Math.floor(1000 + Math.random() * 9000).toString();
    setSessionCode(generatedCode);

    // Emit start session and join room on the server
    socket.emit("startSession", { sessionCode: generatedCode });
  }


  return (
    <div className="main-menu" style={{
      backgroundImage: `url(${mainBG})`,
    }}>
      
        {
          sessionCode ?
            (
              <div className="host-wrapper">
                <h1>Host Screen</h1>
                <QRCodeCanvas value={`http://localhost:5001/join?code=${sessionCode}`} />
                <h2 style={{marginBottom:'0px'}}>Session Code: {sessionCode}</h2>
                <h3>Players Joined ({playerCount}/4):</h3>
                
                <div className="joined-players">
                  {players.map((player, index) => (
                      <div key={index} className="character-card-host" style={{backgroundImage:`url(${abbot})`}}>
                        <div className="player-name">
                          {player.name} - {player.character}
                        </div>
                      </div>
                  ))}
                </div>
                

                {/* <ul>
                  {players.map((player, index) => (
                    <li key={index}>{player.name} - {player.character}</li>
                  ))}
                </ul> */}
              </div>
            ) :
            (
              <div className="menu-wrapper">
                <button onClick={startGame} className="start-button">Start Game</button>
              </div>
            )
        }
      
    </div>
  );
}

export default Host;
