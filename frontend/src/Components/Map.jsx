import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const Map = ({ location, deliveryAgentId }) => (
  <MapContainer
    center={[location.latitude, location.longitude]}
    zoom={13}
    style={{ height: "400px", width: "100%" }}
  >
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    />
    <Marker position={[location.latitude, location.longitude]}>
      <Popup>
        Delivery Agent {deliveryAgentId}
        <br />
        Lat: {location.latitude}, Lon: {location.longitude}
      </Popup>
    </Marker>
  </MapContainer>
);

export default Map;
