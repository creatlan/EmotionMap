export const getEmotionColor = (label, emotionColors = {}) => {
    // If we have the emotion color from MongoDB, use it
    if (emotionColors && label && emotionColors[label]) {
      return emotionColors[label];
    }
      // Fallback to default colors if MongoDB data isn't available
    const defaultColors = {
      joy: "#FF7F0E",      // Orange
      sadness: "#1F77B4",  // Blue
      anger: "#E377C2",    // Pink
      love: "#D62728",     // Red
      fear: "#9467BD",     // Purple
      surprise: "#2CA02C"  // Green
    };
    
    return defaultColors[label] || "#7F7F7F"; // Gray as default if no match
  };
  