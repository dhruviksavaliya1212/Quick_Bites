// deliveryLocationSender.js
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import axios from "axios";


  const [datas, setdatas] = useState({});
  const token = localStorage.getItem("deliveryAgent-token");
  const decoded = jwtDecode(token);
  const deliveryAgentId = decoded.agentId;

  
    const fetchProfile = async () => {
      
      
      const { data } = await axios.post(
        `${backend}/api/delivery-agent/get-agentprofile`,
        { deliveryAgentId}
      )
    if(data)
    {
      setdatas({name:data.firstName,phone:data.contactNo,profilePic:data.profilePhoto});
      console.log(location);
      
    }
    }
  
    
   useEffect(() => {
    fetchProfile();
  
   }, [])


const socket = io("https://delivery-quickbites.vercel.app/track");
const deliveryBoyId = deliveryAgentId // From login/auth

socket.emit("joinRoom", deliveryBoyId);

// Continuously track and send
navigator.geolocation.watchPosition((pos) => {
  const { latitude, longitude } = pos.coords;

  socket.emit("locationUpdate", {
    deliveryBoyId,
    setdatas,
    lat: latitude,
    lng: longitude
  });
});
