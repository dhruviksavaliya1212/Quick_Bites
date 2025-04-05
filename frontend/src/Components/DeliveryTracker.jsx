import React, { useContext, useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../Context/AppContext";
import axios from "axios";
import vegetarian from "../assets/vegetarian.webp";
import { assets } from "../assets/assets";
import easyinvoice from "easyinvoice";
import { toast } from "react-toastify";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { io } from 'socket.io-client'; // Import Socket.IO client

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const LAST_COORDS_KEY = 'lastDeliveryCoords';

// DeliveryTracker Component
const DeliveryTracker = ({ deliveryAgentId }) => {
  const [location, setLocation] = useState(() => {
    const storedCoords = localStorage.getItem(LAST_COORDS_KEY);
    if (storedCoords) {
      try {
        return JSON.parse(storedCoords);
      } catch (error) {
        console.error("Error parsing stored coordinates:", error);
        return null;
      }
    }
    return null;
  });
  const { backend } = useContext(AppContext);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!deliveryAgentId) {
      return; // Don't connect if no deliveryAgentId
    }

    // Initialize Socket.IO connection if not already connected
    if (!socketRef.current) {
      socketRef.current = io(backend, {
        transports: ['websocket'], // Ensure only WebSocket is used
        withCredentials: true,
      });
    }

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('Connected to WebSocket for location updates');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket for location updates');
    });

    socket.on('locationUpdate', (data) => {
      if (data.deliveryAgentId === deliveryAgentId) {
        const newLocation = {
          latitude: data.latitude,
          longitude: data.longitude,
        };
        setLocation(newLocation);
        try {
          localStorage.setItem(LAST_COORDS_KEY, JSON.stringify(newLocation));
        } catch (error) {
          console.error("Error saving coordinates to localStorage:", error);
        }
        console.log(`📍 Live location update for ${deliveryAgentId}: Lat ${data.latitude}, Lon ${data.longitude}`);
      }
    });

    return () => {
      if (socket) {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('locationUpdate');
      }
    };
  }, [deliveryAgentId, backend]);

  return (
    <div style={{ marginTop: "20px" }}>
      <h2 className="text-xl font-semibold text-zinc-800">
        Tracking Delivery Agent: {deliveryAgentId}
      </h2>

      {location ? (
        <MapContainer
          center={[location.latitude, location.longitude]}
          zoom={20}
          style={{ height: "400px", width: "100%", marginTop: "10px" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© <a href="https://www.openstreetmap.org/copyright">Powered by Quickbites Solutions</a>'
          />
          <Marker position={[location.latitude, location.longitude]}>
            <Popup>
              Delivery Agent {deliveryAgentId} <br />
              Lat: {location.latitude.toFixed(6)}, Lon: {location.longitude.toFixed(6)}
            </Popup>
          </Marker>
        </MapContainer>
      ) : (
        <p className="text-md font-semibold text-zinc-700 mt-3">
          {localStorage.getItem(LAST_COORDS_KEY)
            ? "Loading last known delivery agent location..."
            : "Waiting for delivery agent's live location..."}
        </p>
      )}
    </div>
  );
};

export default DeliveryTracker;
