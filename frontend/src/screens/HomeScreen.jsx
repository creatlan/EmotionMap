import React, { useState, useEffect, useRef } from "react";
import MapComponent from "../MapComponent";
import EmotionForm from "../EmotionForm";
import Header from "../components/Header";
import "./HomeScreen.css";
import pointsIcon from "../assets/points_clust.svg";
import clustersIcon from "../assets/circles_clust.svg";
import plusIcon from "../assets/plus.svg";
import minusIcon from "../assets/minus.svg";



const HomeScreen = ({
  selectedCoords,
  setSelectedCoords,
  markers,
  handleAddMarker,
  clusterCount,
  setClusterCount,
  isClusterMode,
  toggleMode,
}) => {

  const historyRef = useRef(null);

  const [showHistory, setShowHistory] = useState(false);

  const handleSelectHistory = (coords) => {
    setSelectedCoords(coords);
    setShowHistory(false);
  };

  const [showControls, setShowControls] = useState(false);
  const [showClusterSelector, setShowClusterSelector] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (historyRef.current && !historyRef.current.contains(e.target)) {
        setShowHistory(false);
      }
    };
  
    if (showHistory) {
      document.addEventListener("mousedown", handleClickOutside);
    }
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showHistory]);
  

  return (
    <div className="home-screen">
      <Header />

      <div className="search-form">
        <form className="form">
          <button type="submit">
            <svg width="17" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="search">
              <path d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9" stroke="currentColor" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </button>
          <input 
            className="input" 
            placeholder="Type your text" 
            required 
            type="text" 
            onFocus={() => setShowHistory(true)}
          />
          <button className="reset" type="reset">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

        {showHistory && (
          <>
            <div className="history-popup" ref={historyRef}>
              {markers.slice(0, 5).map((point, index) => (
                <div 
                  key={index} 
                  className="history-item"
                  onClick={() => handleSelectHistory(point.coords)}
                >
                  <div className="history-top">
                    <div className="history-point">Point {index + 1}</div>
                    <div className="history-label">{point.label} {Math.round(point.score * 100)}%</div>
                  </div>
                  <div className="history-text">{point.text}</div>
                </div>
              ))}
            </div>
          </>
        )}
        </form>
      </div>

      <div className="map-container">
        <MapComponent
          selectedCoords={selectedCoords}
          setSelectedCoords={setSelectedCoords}
          markers={markers}
          clusterCount={clusterCount}
          isClusterMode={isClusterMode}
        />
      </div>

      // for adding new emotions - upload to button later
      <EmotionForm selectedCoords={selectedCoords} onAdd={handleAddMarker} />

      <div className="map-controls">
        <button className="map-button" onClick={() => console.log("Toggle My Points")}>
          👤
        </button>
        <button
          className="map-button"
          onClick={() => {
            toggleMode();
            setShowClusterSelector(true); 
          }}
        >
          <img
            src={isClusterMode ? clustersIcon : pointsIcon}
            alt={isClusterMode ? "Clusters" : "Points"}
          />
        </button>


        <button className="map-button" onClick={() => window.mapZoomIn?.()}>
          <img src={plusIcon} alt="Zoom In" className="zoom-icon"/>
        </button>

        <button className="map-button" onClick={() => window.mapZoomOut?.()}>
          <img src={minusIcon} alt="Zoom Out" className="zoom-icon"/>
        </button>


        {isClusterMode && showClusterSelector && (
          <div className="cluster-popup">
            <div className="cluster-header">
              <label className="cluster-label">Clusters: {clusterCount}</label>
            </div>

            <input
              type="range"
              min="2"
              max="10"
              value={clusterCount}
              onChange={(e) => setClusterCount(Number(e.target.value))}
            />
          </div>
        )}
  

      </div>
    </div>
  );
};

export default HomeScreen;