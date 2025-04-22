import React, { useState, useEffect } from "react";
import MapComponent from "./MapComponent";
import EmotionForm from "./EmotionForm";

function App() {
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [clusterCount, setClusterCount] = useState(2); // State for slider
  const [isClusterMode, setIsClusterMode] = useState(false); // State for toggle button

  useEffect(() => {
    const loadPoints = async () => {
      const res = await fetch("http://localhost:8000/points");
      const data = await res.json();
      setMarkers(data);
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
    <div>
      <h1>EmotionMap</h1>
      <div>
        <label htmlFor="cluster-slider">Clusters: {clusterCount}</label>
        <input
          id="cluster-slider"
          type="range"
          min="2"
          max="10"
          value={clusterCount}
          onChange={(e) => setClusterCount(Number(e.target.value))}
        />
        <button onClick={toggleMode}>
          {isClusterMode ? "Switch to Points" : "Switch to Clusters"}
        </button>
      </div>
      <MapComponent
        selectedCoords={selectedCoords}
        setSelectedCoords={setSelectedCoords}
        markers={markers}
        clusterCount={clusterCount}
        isClusterMode={isClusterMode}
      />
      <EmotionForm
        selectedCoords={selectedCoords}
        onAdd={handleAddMarker}
      />
    </div>
  );
}

export default App;
