import React, { useContext, useEffect, useState, useRef } from "react";
import { AppContext } from "../Context/AppContext";
import vegetarian from "../assets/vegetarian.webp";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { io } from "socket.io-client";
import { PhoneCall } from "lucide-react";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const LAST_COORDS_KEY = "lastDeliveryCoords";

const DeliveryTracker = ({ deliveryAgentId }) => {
  const [data, setData] = useState(null);
  const [location, setLocation] = useState(() => {
    const storedCoords = localStorage.getItem(LAST_COORDS_KEY);
    if (storedCoords) {
      try {
        const parsed = JSON.parse(storedCoords);
        return parsed;
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
    if (!deliveryAgentId) return;

    if (!socketRef.current) {
      socketRef.current = io(backend, {
        transports: ["websocket"],
        withCredentials: true,
      });
    }

    const socket = socketRef.current;

    socket.on("connect", () => console.log("Connected to WebSocket"));
    socket.on("disconnect", () => console.log("Disconnected from WebSocket"));

    socket.on("locationUpdate", (incomingData) => {
      if (!incomingData || typeof incomingData !== "object") return;

      const { agentInfo, latitude, longitude } = incomingData;

      localStorage.setItem("agentInfo", JSON.stringify(agentInfo));

      if (incomingData.deliveryAgentId !== deliveryAgentId) return;

      if (typeof latitude !== "number" || typeof longitude !== "number") return;

      const newLocation = { latitude, longitude };
      setLocation(newLocation);

      try {
        localStorage.setItem(LAST_COORDS_KEY, JSON.stringify(newLocation));
      } catch (error) {
        console.error("Error saving location:", error);
      }
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("locationUpdate");
    };
  }, [deliveryAgentId, backend]);

  useEffect(() => {
    const agentInfoData = localStorage.getItem("agentInfo");
    if (agentInfoData) {
      const parsedData = JSON.parse(agentInfoData);
      setData(parsedData);
    }
  }, []);

  return (
    <div className="mt-6  space-y-4 px-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-zinc-800">
          Tracking: {data?.name || "Loading..."}
        </h2>
        {data?.phone && (
          <a
            href={`tel:${data.phone}`}
            className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-xl shadow hover:bg-green-700 transition-all"
          >
            <PhoneCall size={18} />
            <span className="text-sm">Call</span>
          </a>
        )}
      </div>

      <div className="rounded-2xl  overflow-hidden shadow-lg border border-gray-200">
        {location ? (
          <MapContainer
            center={[location.latitude, location.longitude]}
            zoom={18}
            scrollWheelZoom
            style={{ height: "400px", width: "100%" }}
            className="rounded-xl"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; Powered By QuickBites Solutions'
            />
            <Marker position={[location.latitude, location.longitude]}>
              <Popup>
                <div className="text-center">
                  <img
                    src={data?.profilePic || vegetarian}
                    alt="Agent"
                    className="w-16 h-16 rounded-full object-cover mx-auto mb-2"
                  />
                  <p className="font-semibold text-zinc-800">{data?.name}</p>
                  <p className="text-xs text-gray-500">{data?.phone}</p>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        ) : (
          <div className="text-md font-medium text-zinc-700 p-4 text-center">
            {localStorage.getItem(LAST_COORDS_KEY)
              ? "Loading last known delivery agent location..."
              : "Waiting for live location..."}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryTracker;
