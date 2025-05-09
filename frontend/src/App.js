import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import AboutScreen from "./screens/AboutScreen"; 
import LoginScreen from "./screens/LoginScreen";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import { EmotionsProvider } from "./EmotionsContext";

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

  // Function to load points from backend
  const loadPoints = async () => {
    if (!currentUser) return;
    try {
      let res;
      if (isGlobalSearchMode) {
        res = await fetch(`http://localhost:8001/points`);
      } else {
        res = await fetch(`http://localhost:8001/points/${currentUser.username}`);
      }
      if (!res.ok) throw new Error(`Failed to load points: ${res.status}`);
      const data = await res.json();
      console.log(isGlobalSearchMode ? "Loaded all points (global mode):" : "Loaded user points (personal mode):", data);
      setMarkers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadPoints();
  }, [currentUser, isGlobalSearchMode]);
  
  const handleAddMarker = async (point) => {
    if (point._id) {
      // Update existing point in state
      setMarkers(prev => prev.map(marker => marker._id === point._id ? point : marker));
    } else {
      // New point created: reload points from server to get real _id
      await loadPoints();
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
      <EmotionsProvider>
        <AppContent />
      </EmotionsProvider>
    </AuthProvider>
  );
}

export default App;
