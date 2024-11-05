// src/services/socket.js
import { io } from "socket.io-client";

const socket = io("http://localhost:5001"); // URL should match your backend

export default socket;