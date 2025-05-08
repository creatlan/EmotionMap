import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import AboutScreen from "./screens/AboutScreen"; 
import LoginScreen from "./screens/LoginScreen";

function App() {
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [clusterCount, setClusterCount] = useState(2);
  const [isClusterMode, setIsClusterMode] = useState(false);

  useEffect(() => {
    const loadPoints = async () => {
      try {
        const res = await fetch("http://localhost:8001/points");
        const data = await res.json();
        console.log("Loaded points:", data);
        setMarkers(data);
      } catch (err) {
        console.error("Failed to load points:", err);
      }
    };
    loadPoints();
  }, []);
  

  const handleAddMarker = (point) => {
    setMarkers((prev) => [...prev, point]);
  };

  const toggleMode = () => {
    setIsClusterMode((prev) => !prev);
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <HomeScreen
            selectedCoords={selectedCoords}
            setSelectedCoords={setSelectedCoords}
            markers={markers}
            handleAddMarker={handleAddMarker}
            clusterCount={clusterCount}
            setClusterCount={setClusterCount}
            isClusterMode={isClusterMode}
            toggleMode={toggleMode}
          />
        }
      />
      <Route path="/about" element={<AboutScreen />} />
      <Route path="/login" element={<LoginScreen />} />
    </Routes>
  );
}

export default App;
