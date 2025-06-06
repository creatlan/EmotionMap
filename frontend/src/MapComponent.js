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
import AddPointMarker from "./components/AddPointMarker";
import { useEmotions, getEmotionColorSafe } from "./EmotionsContext";

import "./MapComponent.css";

function LocationMarker({ setSelectedCoords }) {
  useMapEvents({
    click(e) {
      if (e.latlng && e.latlng.lat !== undefined && e.latlng.lng !== undefined) {
        setSelectedCoords(e.latlng);
      } else {
        console.error("Invalid LatLng object:", e.latlng);
      }
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

    window.mapFlyTo = (coords) => {
      if (coords && coords.lat !== undefined && coords.lng !== undefined) {
        map.flyTo([coords.lat, coords.lng], 13, {
          animate: true,
          duration: 1.5,
        });
      }
    };

    return () => {
      delete window.mapZoomIn;
      delete window.mapZoomOut;
      delete window.mapFlyTo;
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
  handleAddMarker, 
  isNewPoint,
  isGlobalSearchMode,
  currentUser
}) => {
  const [clusters, setClusters] = useState([]);
  const [editPoint, setEditPoint] = useState(null); // Define editPoint state
  const { emotionColors, getColor } = useEmotions();
  
  const handleEditPoint = (point) => {
    console.log("Updating editPoint with:", point);
    setEditPoint(point);
  };

  useEffect(() => {
    if (isClusterMode) {
      const fetchClusters = async () => {
        try {
          let url;
          if (isGlobalSearchMode) {
            // Fetch global clusters
            url = `http://localhost:8000/clusters?n=${clusterCount}`;
          } else {
            // Fetch user-specific clusters
            url = `http://localhost:8000/clusters/${currentUser.username}?n=${clusterCount}`;
          }
          
          const res = await fetch(url);
          if (!res.ok) throw new Error(`Server responded with ${res.status}`);
          const data = await res.json();
          setClusters(data);
        } catch (err) {
          console.error("Error fetching clusters:", err);
        }
      };
      fetchClusters();
    }
  }, [isClusterMode, clusterCount, isGlobalSearchMode, currentUser]);

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
      {selectedCoords && isNewPoint && !isClusterMode && (
        <>
          <div  
            className="map-click-blocker"
            onClick={() => setSelectedCoords(null)}
          />          
          <AddPointMarker coords={selectedCoords} />
        </>
      )}



      {isClusterMode
        ? clusters.map((cluster, i) => (
            cluster.center && cluster.center.lat !== undefined && cluster.center.lng !== undefined && (
              <Marker                key={i}                position={[cluster.center.lat, cluster.center.lng]}
                icon={L.divIcon({
                  className: "custom-icon",
                  html: `<div style="background:${getEmotionColorSafe(cluster.mode, emotionColors)};width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;">${cluster.points.length}</div>`
                })}
              >
                <Popup>
                  <b>Cluster ID:</b> {cluster.cluster}<br />
                  <b>Dominant Emotion:</b> {cluster.mode || "N/A"}<br />
                  <b>Points:</b> {cluster.points.length}
                </Popup>
              </Marker>
            )
          ))
        : markers.map((point, i) => (
            point.coords && point.coords.lat !== undefined && point.coords.lng !== undefined && (
              <Marker                key={i}                position={[point.coords.lat, point.coords.lng]}
                icon={L.divIcon({
                  className: "custom-icon",
                  html: `<div style="background:${getEmotionColorSafe(point.label, emotionColors)};width:20px;height:20px;border-radius:50%"></div>`
                })}
              >
                <Popup>
                  <b>{point.label}</b> ({Math.round(point.score * 100)}%)<br />
                  {point.text}
                </Popup>
              </Marker>
            )
          ))}
    </MapContainer>
  );
};

export default MapComponent;
