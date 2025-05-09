import React, { useState, useEffect, useRef } from "react";
import MapComponent from "../MapComponent";
import EmotionForm from "../EmotionForm";
import Header from "../components/Header";
import "./HomeScreen.css";
import "./search-mode.css";
import "./toast-notification.css";
import "./view-indicator.css";
import pointsIcon from "../assets/points_clust.svg";
import clustersIcon from "../assets/circles_clust.svg";
import plusIcon from "../assets/plus.svg";
import minusIcon from "../assets/minus.svg";
import editIcon from "../assets/circle_edit.svg";
import searchModeIcon from "../assets/search_mode.svg";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";



const HomeScreen = ({
  selectedCoords,
  setSelectedCoords,
  markers,
  handleAddMarker,
  clusterCount,
  setClusterCount,
  isClusterMode,
  toggleMode,
  isGlobalSearchMode,
  setIsGlobalSearchMode,
}) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();  
  
  const [isNewPoint, setIsNewPoint] = useState(false);
  const [toast, setToast] = useState(null);
  const historyRef = useRef(null);

  const [showHistory, setShowHistory] = useState(false);

  const [editPoint, setEditPoint] = useState(null);

  const handleMapClick = (coords) => {
    setSelectedCoords(coords);
    setIsNewPoint(true);
  };

  const handleSelectHistory = (coords) => {
    setSelectedCoords(coords);
    setIsNewPoint(false);
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
    // Уведомление пользователя о смене режима поиска
  useEffect(() => {
    if (isGlobalSearchMode === undefined) return; // Skip first render
    
    const message = isGlobalSearchMode 
      ? 'Switched to Global View: You can now see points from all users'
      : 'Switched to Personal View: You can now see only your points';
    
    setToast(message);
    
    const timer = setTimeout(() => {
      setToast(null);
    }, 4000);
    
    return () => clearTimeout(timer);
  }, [isGlobalSearchMode]);
  
  return (
    <div className="home-screen">      <Header />
      
      {toast && (
        <div className="toast-notification">
          {toast}
        </div>
      )}
      
      <div className="view-indicator">
        <span className={isGlobalSearchMode ? "indicator-dot global-dot" : "indicator-dot personal-dot"}></span>
        <span className={isGlobalSearchMode ? "global-indicator" : "personal-indicator"}>
          {isGlobalSearchMode ? "Global View" : "Personal View"}
        </span>
      </div>

      <div className="search-form">
        <form className="form">
          <button type="submit">
            <svg width="17" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="search">
              <path d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9" stroke="currentColor" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </button>
          <input 
            className="input" 
            placeholder="Type your text..." 
            required 
            type="text" 
            onFocus={() => setShowHistory(true)}
          />
          <button className="reset" type="reset">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          </form>


        {showHistory && (
          <>
            <div className="history-popup" ref={historyRef}>
              {markers.slice(0, 5).map((point, index) => (
                <div 
                key={index} 
                className="history-item"
              >
                <div className="history-top">
                  <div className="history-point">Point {index + 1}</div>
                  <div className="history-label">{point.label} {Math.round(point.score * 100)}%</div>
                </div>
                <div className="history-bottom">
                  <div 
                    className="history-text" 
                    onClick={() => handleSelectHistory(point.coords)}
                  >
                    {point.text}
                  </div>
                  <img 
                    src={editIcon} 
                    alt="Edit" 
                    className="edit-icon" 
                    onClick={() => {
                      setEditPoint(point);
                      setSelectedCoords(point.coords);
                      setIsNewPoint(true);
                      setShowHistory(false);
                    }}                    
                  />
                </div>
              </div>
              
              ))}
            </div>
          </>
        )}
      </div>      <div className="map-container">
        <MapComponent
          selectedCoords={selectedCoords}
          setSelectedCoords={handleMapClick}  // handle misclick
          isNewPoint={isNewPoint} 
          markers={markers}
          clusterCount={clusterCount}
          isClusterMode={isClusterMode}
          handleAddMarker={handleAddMarker}
          isGlobalSearchMode={isGlobalSearchMode}
          currentUser={currentUser}
        />
      </div>
      {(selectedCoords && (isNewPoint || editPoint)) && (
        <EmotionForm
          selectedCoords={selectedCoords}
          onAdd={handleAddMarker}
          onClose={() => {
            setSelectedCoords(null);
            setEditPoint(null);
            setIsNewPoint(false);
          }}
          editPoint={editPoint}
          setEditPoint={setEditPoint}
        />      )}      <div className="map-controls">
        <button
          className="map-button search-mode-button"
          onClick={() => setIsGlobalSearchMode(!isGlobalSearchMode)}
          title={isGlobalSearchMode ? "Switch to Personal View" : "Switch to Global View"}
        >
          <img
            src={searchModeIcon}
            alt={isGlobalSearchMode ? "Global Mode" : "Personal Mode"}
            className="search-mode-icon"
          />
          <span className="search-mode-indicator" style={{ 
            backgroundColor: isGlobalSearchMode ? '#e74c3c' : '#2ecc71',
          }}></span>
          <span className="mode-tooltip">
            {isGlobalSearchMode ? 'Global View' : 'Personal View'}
          </span>
        </button>        <button
          className="map-button"
          onClick={() => {
            toggleMode();
            setShowClusterSelector(true); 
          }}
          title={isClusterMode ? "Switch to Points View" : "Switch to Clusters View"}
        >
          <img
            src={isClusterMode ? clustersIcon : pointsIcon}
            alt={isClusterMode ? "Clusters" : "Points"}
          />
          <span className="mode-tooltip">
            {isClusterMode ? 'Clusters View' : 'Points View'}
          </span>
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