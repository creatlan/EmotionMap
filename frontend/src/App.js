import React, { useState, useEffect } from "react";
import MapComponent from "./MapComponent";
import EmotionForm from "./EmotionForm";

function App() {
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [markers, setMarkers] = useState([]);

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

  return (
    <div>
      <h1>EmotionMap</h1>
      <MapComponent
        selectedCoords={selectedCoords}
        setSelectedCoords={setSelectedCoords}
        markers={markers}
      />
      <EmotionForm
        selectedCoords={selectedCoords}
        onAdd={handleAddMarker}
      />
    </div>
  );
}

export default App;
