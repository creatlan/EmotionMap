import React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { getEmotionColor } from "./utils/colors";

function LocationMarker({ setSelectedCoords }) {
  useMapEvents({
    click(e) {
      setSelectedCoords(e.latlng);
    },
  });
  return null;
}

const MapComponent = ({ selectedCoords, setSelectedCoords, markers }) => {
  return (
    <MapContainer center={[55.75, 37.61]} zoom={12} style={{ height: "400px" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationMarker setSelectedCoords={setSelectedCoords} />
      {markers.map((point, i) => (
        <Marker
          key={i}
          position={[point.coords.lat, point.coords.lng]}
          icon={L.divIcon({
            className: 'custom-icon',
            html: `<div style="background:${getEmotionColor(point.label)};width:20px;height:20px;border-radius:50%"></div>`,
          })}
        >
          <Popup>
            <b>{point.label}</b> ({Math.round(point.score * 100)}%)<br />
            {point.text}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
