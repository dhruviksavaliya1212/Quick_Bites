// deliveryLocationSender.js
import io from "socket.io-client";
import { jwtDecode } from "jwt-decode";

  const token = localStorage.getItem("deliveryAgent-token");
  const decoded = jwtDecode(token);
  const deliveryAgentId = decoded.agentId;

const socket = io("http://localhost:3000/track");
const deliveryBoyId = deliveryAgentId // From login/auth

socket.emit("joinRoom", deliveryBoyId);

// Continuously track and send
navigator.geolocation.watchPosition((pos) => {
  const { latitude, longitude } = pos.coords;

  socket.emit("locationUpdate", {
    deliveryBoyId,
    lat: latitude,
    lng: longitude
  });
});
