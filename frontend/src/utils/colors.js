export const getEmotionColor = (label) => {
    const map = {
      joy: "yellow",
      sadness: "blue",
      anger: "red",
      calm: "green",
      surprise: "orange",
      fear: "purple",
      neutral: "gray",
    };
    return map[label] || "black";
  };
  