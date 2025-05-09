import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import AboutScreen from "./screens/AboutScreen"; 
import LoginScreen from "./screens/LoginScreen";
import { AuthProvider, useAuth } from "./auth/AuthContext";

// Private route component
const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>; // Show loading indicator
  }
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function AppContent() {
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [clusterCount, setClusterCount] = useState(2);
  const [isClusterMode, setIsClusterMode] = useState(false);
  const [isGlobalSearchMode, setIsGlobalSearchMode] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    const loadPoints = async () => {
      if (!currentUser) return;
      
      try {
        if (isGlobalSearchMode) {
          // Load all points in global mode
          const res = await fetch(`http://localhost:8001/points`);
          const data = await res.json();
          console.log("Loaded all points (global mode):", data);
          setMarkers(data);
        } else {
          // Load only user's points in personal mode
          const res = await fetch(`http://localhost:8001/points/${currentUser.username}`);
          const data = await res.json();
          console.log("Loaded user points (personal mode):", data);
          setMarkers(data);
        }
      } catch (err) {
        console.error("Failed to load points:", err);
      }
    };
    loadPoints();
  }, [currentUser, isGlobalSearchMode]);
  
  const handleAddMarker = (point) => {
    // Check if this is an update or creation of a new point
    if (point._id) {
      // Update existing point
      setMarkers(prev => 
        prev.map(marker => 
          marker._id === point._id ? point : marker
        )
      );
    } else {
      // Add new point
      setMarkers(prev => [...prev, point]);
    }
  };

  const toggleMode = () => {
    setIsClusterMode((prev) => !prev);
  };
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PrivateRoute>
            <HomeScreen
              selectedCoords={selectedCoords}
              setSelectedCoords={setSelectedCoords}
              markers={markers}
              handleAddMarker={handleAddMarker}
              clusterCount={clusterCount}
              setClusterCount={setClusterCount}
              isClusterMode={isClusterMode}
              toggleMode={toggleMode}
              isGlobalSearchMode={isGlobalSearchMode}
              setIsGlobalSearchMode={setIsGlobalSearchMode}
            />
          </PrivateRoute>
        }
      />
      <Route path="/about" element={<AboutScreen />} />
      <Route path="/login" element={<LoginScreen />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
