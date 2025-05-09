import React, { useState, useEffect } from "react";
import "./EmotionForm.css";
import { useAuth } from "./auth/AuthContext";
import { useEmotions } from "./EmotionsContext";

const EmotionForm = ({ selectedCoords, onAdd, onClose, editPoint, setEditPoint }) => {
  const [text, setText] = useState("");
  const [selectedEmotion, setSelectedEmotion] = useState("auto");
  const { currentUser } = useAuth();
  const { emotions, loading } = useEmotions();

  useEffect(() => {
    if (editPoint) {
      setText(editPoint.text);
      setSelectedEmotion("auto"); // Reset to auto when editing
    } else {
      setText("");
      setSelectedEmotion("auto");
    }
  }, [editPoint]);

  const handleSubmit = async () => {
    if (!selectedCoords || !text.trim()) return;
    const timestamp = new Date().toISOString();
    
    let label, score;

    if (selectedEmotion !== "auto") {
      // User selected an emotion manually - use it directly and train the model
      label = selectedEmotion;
      score = 1.0; // Max confidence since user selected it

      // Send request to train the model with this text and emotion
      try {
        const trainRes = await fetch("http://localhost:8000/models/train", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text,
            label
          })
        });
        
        if (!trainRes.ok) {
          console.warn("Model training failed, but continuing with user-selected emotion");
        } else {
          console.log("Model trained successfully with user data");
        }
      } catch (err) {
        console.error("Error training model:", err);
        // Continue with user selection even if training fails
      }
    } else {
      // Auto mode - analyze the text to determine emotion
      try {
        const analyzeRes = await fetch("http://localhost:8000/models/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: editPoint ? editPoint.username : currentUser?.username,
            text,
            coords: selectedCoords
          })
        });
        
        if (!analyzeRes.ok) {
          alert("Error while analyzing emotion");
          return;
        }
        
        const result = await analyzeRes.json();
        label = result.label;
        score = result.score;
      } catch (err) {
        alert("Error analyzing text");
        console.error("Analysis error:", err);
        return;
      }
    }

    if (editPoint?._id) {
      // Update existing point
      console.log("Sending update request with payload:", {
        id: editPoint._id,
        text,
        coords: selectedCoords,
        label,
        score,
        timestamp
      });
      
      const updateRes = await fetch("http://localhost:8001/points/", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editPoint._id,
          text,
          coords: selectedCoords,
          label,
          score,
          timestamp
        })
      });
      
      if (!updateRes.ok) {
        alert("Error while updating point");
        return;
      }
      
      onAdd({ ...editPoint, text, coords: selectedCoords, label, score, timestamp });
    } else {
      // Create new point
      if (selectedEmotion === "auto") {
        // Use the ML service to analyze and create point in one step
        console.log("Sending create request with payload:", {
          username: currentUser?.username,
          text,
          coords: selectedCoords
        });
        
        const res = await fetch("http://localhost:8000/points", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: currentUser?.username,
            text,
            coords: selectedCoords
          })
        });
        
        if (!res.ok) {
          alert("Error while analyzing emotion");
          return;
        }
        
        const data = await res.json();
        
        onAdd({
          username: currentUser?.username,
          text,
          coords: selectedCoords,
          label: data.label,
          score: data.score,
          timestamp
        });
      } else {
        // Create point with manually selected emotion
        console.log("Creating point with manually selected emotion:", {
          username: currentUser?.username,
          text,
          coords: selectedCoords,
          label,
          score,
          timestamp
        });
        
        const res = await fetch("http://localhost:8001/points", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: currentUser?.username,
            text,
            coords: selectedCoords,
            label,
            score,
            timestamp
          })
        });
        
        if (!res.ok) {
          alert("Error while creating point");
          return;
        }
        
        onAdd({
          username: currentUser?.username,
          text,
          coords: selectedCoords,
          label,
          score,
          timestamp
        });
      }
    }
    
    setText("");
    setSelectedEmotion("auto");
    setEditPoint(null);
    onClose?.();
  };

  const getEmotionOptions = () => {
    if (loading || !emotions || !emotions.length) {
      return [<option key="auto" value="auto">Auto (Analyze)</option>];
    }
    
    return [
      <option key="auto" value="auto">Auto (Analyze)</option>,
      ...emotions.map(emotion => (
        <option key={emotion.emotion} value={emotion.emotion}>
          {emotion.emotion.charAt(0).toUpperCase() + emotion.emotion.slice(1)}
        </option>
      ))
    ];
  };

  const isActive = text.length > 0;

  return (
    <div className="emotion-form-wrapper">
      <div className="click-blocker" onClick={onClose} />
      <div className="emotion-form-container">
        <div className="input-wrapper">
          <textarea
            id="emotion-textarea"
            className="input-field"
            rows="1"
            value={text}
            maxLength={500}
            onChange={(e) => setText(e.target.value)}
          />
          <label
            htmlFor="emotion-textarea"
            className={`floating-label ${isActive ? "active" : ""}`}
          >
            Describe your emotion...
          </label>
          <button
            className={`floating-close ${isActive ? "active" : ""}`}
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        
        <div className="emotion-selector-container">
          <label htmlFor="emotion-selector">Emotion:</label>
          <select 
            id="emotion-selector" 
            value={selectedEmotion} 
            onChange={(e) => setSelectedEmotion(e.target.value)}
            className="emotion-selector"
          >
            {getEmotionOptions()}
          </select>
        </div>
        
        <button className="emotion-button" onClick={handleSubmit}>
          {editPoint ? "Update" : (selectedEmotion === "auto" ? "Add & Analyze" : "Add & Train")}
        </button>
      </div>
    </div>
  );
};

export default EmotionForm;
