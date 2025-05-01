import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents
} from "react-leaflet";
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

function FlyToSelected({ selectedCoords }) {
  const map = useMap();

  useEffect(() => {
    if (selectedCoords) {
      const timer = setTimeout(() => {
        map.flyTo([selectedCoords.lat, selectedCoords.lng], 13, {
          animate: true,
          duration: 2,
        });
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [selectedCoords, map]);
  return null;
}

function MapControlBridge() {
  const map = useMap();

  useEffect(() => {
    window.mapZoomIn = () => map.setZoom(map.getZoom() + 1);
    window.mapZoomOut = () => map.setZoom(map.getZoom() - 1);

    return () => {
      delete window.mapZoomIn;
      delete window.mapZoomOut;
    };
  }, [map]);

  return null;
}

const MapComponent = ({
  selectedCoords,
  setSelectedCoords,
  markers,
  clusterCount,
  isClusterMode,
}) => {
  const [clusters, setClusters] = useState([]);

  useEffect(() => {
    if (isClusterMode) {
      const fetchClusters = async () => {
        try {
          const res = await fetch(`http://localhost:8000/clusters?n=${clusterCount}`);
          if (!res.ok) throw new Error(`Server responded with ${res.status}`);
          const data = await res.json();
          setClusters(data);
        } catch (err) {
          console.error("Error fetching clusters:", err);
        }
      };
      fetchClusters();
    }
  }, [isClusterMode, clusterCount]);

  return (
    <MapContainer
      center={[55.75, 37.61]}
      zoom={12}
      zoomControl={false}
      className="map-inner-container"
    >
      <MapControlBridge />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
        crossOrigin=""
      />
      <LocationMarker setSelectedCoords={setSelectedCoords} />
      <FlyToSelected selectedCoords={selectedCoords} />
      {isClusterMode
        ? clusters.map((cluster, i) => (
            <Marker
              key={i}
              position={[cluster.center.lat, cluster.center.lng]}
              icon={L.divIcon({
                className: "custom-icon",
                html: `<div style="background:blue;width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;">${cluster.points.length}</div>`
              })}
            >
              <Popup>
                <b>Cluster ID:</b> {cluster.cluster}<br />
                <b>Dominant Emotion:</b> {cluster.mode || "N/A"}<br />
                <b>Points:</b> {cluster.points.length}
              </Popup>
            </Marker>
          ))
        : markers.map((point, i) => (
            <Marker
              key={i}
              position={[point.coords.lat, point.coords.lng]}
              icon={L.divIcon({
                className: "custom-icon",
                html: `<div style="background:${getEmotionColor(point.label)};width:20px;height:20px;border-radius:50%"></div>`
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
