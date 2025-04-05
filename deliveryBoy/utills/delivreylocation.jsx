import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000", { withCredentials: true }); // Adjust based on your backend URL

const DeliveryPanel = ({ deliveryAgentId }) => {
  const [location, setLocation] = useState({ latitude: null, longitude: null });

  useEffect(() => {
    if (!deliveryAgentId) return;

    // Function to get location and send it to backend
    const updateLocation = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const newLocation = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };

            setLocation(newLocation);

            // Send location to backend via WebSockets
            socket.emit("sendLocation", {
              deliveryAgentId,
              latitude: newLocation.latitude,
              longitude: newLocation.longitude,
            });

            console.log(`📍 Sent location: ${newLocation.latitude}, ${newLocation.longitude}`);
          },
          (error) => {
            console.error("❌ Error getting location:", error);
          },
          { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
        );
      } else {
        console.error("❌ Geolocation is not supported by this browser.");
      }
    };

    // Send location every 10 seconds
    const interval = setInterval(updateLocation, 5000);
    updateLocation(); // Initial call

    return () => clearInterval(interval); // Cleanup on unmount
  }, [deliveryAgentId]);

  return (
    <div>
      <h2>🚚 Delivery Panel</h2>
      <p>📌 Tracking ID: {deliveryAgentId}</p>
      {location.latitude && location.longitude ? (
        <p>
          ✅ Latitude: {location.latitude} | Longitude: {location.longitude}
        </p>
      ) : (
        <p>⏳ Fetching location...</p>
      )}
    </div>
  );
};

export default DeliveryPanel;
