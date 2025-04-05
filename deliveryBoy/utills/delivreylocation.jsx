import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:3000", { withCredentials: true }); // Adjust backend URL

const DeliveryPanel = ({ deliveryAgentId }) => {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [datas, setDatas] = useState({});
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);

  const fetchProfile = async () => {
    try {
      const { data } = await axios.post(
        `http://localhost:3000/api/delivery-agent/get-agentprofile`,
        { deliveryAgentId }
      );
      if (data) {
        setDatas({
          name: data?.agentData[0]?.firstName + " " + data?.agentData[0]?.lastName, 
          phone: data?.agentData[0]?.contactNo,
          profilePic: data?.agentData[0]?.profilePhoto
        });
        console.log(data.agentData[0].firstName);
        
        setIsProfileLoaded(true);
      }
    } catch (err) {
      console.error("❌ Error fetching profile:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (!deliveryAgentId || !isProfileLoaded) return;

    const updateLocation = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const newLocation = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };

            setLocation(newLocation);

            // Send location + agent info via WebSocket
            socket.emit("sendLocation", {
              deliveryAgentId,
              agentInfo: datas,
              latitude: newLocation.latitude,
              longitude: newLocation.longitude,
            });

            console.log(`📍 Sent location with profile`,datas,newLocation.longitude,newLocation.latitude,deliveryAgentId);
          },
          (error) => {
            console.error("❌ Error getting location:", error);
          },
          { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
        );
      } else {
        console.error("❌ Geolocation not supported");
      }
    };

    const interval = setInterval(updateLocation, 5000);
    updateLocation();

    return () => clearInterval(interval);
  }, [deliveryAgentId, isProfileLoaded]);

  return (
    <div>
      {/* <h2>🚚 Delivery Panel</h2>
      <p>📌 Tracking ID: {deliveryAgentId}</p>
      {location.latitude && location.longitude ? (
        <p>
          ✅ Lat: {location.latitude} | Long: {location.longitude}
          <br />
          👤 Name: {datas.name} | 📞 Phone: {datas.phone}
        </p>
      ) : (
        <p>⏳ Fetching location...</p>
      )} */}
    </div>
  );
};

export default DeliveryPanel;
