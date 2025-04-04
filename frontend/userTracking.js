// userTracking.js
import io from "socket.io-client";
import L from 'leaflet'; // if using Leaflet
import 'leaflet/dist/leaflet.css';
import { jwtDecode } from "jwt-decode";

const token = localStorage.getItem("deliveryAgent-token");
const decoded = jwtDecode(token);
const deliveryAgentId = decoded.agentId;


const socket = io("http://localhost:3000/track");
const deliveryBoyId = deliveryAgentId // Get from order data

socket.emit("joinRoom", deliveryBoyId);

let map = L.map('map').setView([initialLat, initialLng], 15);
let marker = L.marker([initialLat, initialLng]).addTo(map);

socket.on("location", ({ lat, lng }) => {
  marker.setLatLng([lat, lng]);
  map.panTo([lat, lng]);
});
