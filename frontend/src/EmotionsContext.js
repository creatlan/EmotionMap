import React, { createContext, useContext, useState, useEffect } from 'react';

const EmotionsContext = createContext();

export const useEmotions = () => useContext(EmotionsContext);

export const EmotionsProvider = ({ children }) => {
  const [emotions, setEmotions] = useState([]);
  const [emotionColors, setEmotionColors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmotions = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8001/emotions/');
        if (!response.ok) {
          throw new Error(`Failed to fetch emotions: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Fetched emotions data:', data);
        
        if (data.value && Array.isArray(data.value)) {
          setEmotions(data.value);
          
          // Create a map of emotion to color
          const colorMap = {};
          data.value.forEach(item => {
            colorMap[item.emotion] = item.color;
          });
          setEmotionColors(colorMap);
          console.log('Emotion colors map created:', colorMap);
        } else {
          console.warn('Invalid emotions data structure:', data);
          setError('Invalid emotions data structure');
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching emotions:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmotions();
  }, []);
  return (
    <EmotionsContext.Provider value={{ 
      emotions, 
      emotionColors, 
      loading, 
      error,
      // Add a helper function to get color directly
      getColor: (emotion) => emotionColors[emotion] || null
    }}>
      {children}
    </EmotionsContext.Provider>
  );
};

export default EmotionsContext;

// Add a utility function to get emotion color with error handling
export const getEmotionColorSafe = (label, emotionColors, defaultColor = "#7F7F7F") => {
  if (!label) return defaultColor;
  
  if (emotionColors && emotionColors[label]) {
    return emotionColors[label];
  }
    // Fallback colors from config
  const defaultColors = {
    joy: "#FF7F0E",      // Orange
    sadness: "#1F77B4",  // Blue
    anger: "#E377C2",    // Pink
    love: "#D62728",     // Red
    fear: "#9467BD",     // Purple
    surprise: "#2CA02C"  // Green
  };
  
  return defaultColors[label] || defaultColor;
};
