// socket.js
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // veya sunucu adresin

export default socket;
