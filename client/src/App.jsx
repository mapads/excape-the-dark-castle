// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Host from "./pages/Host";
import Player from "./pages/Player";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Host />} />
        <Route path="/join" element={<Player />} />
      </Routes>
    </Router>
  );
}

export default App;