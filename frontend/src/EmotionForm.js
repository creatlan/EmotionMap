import React, { useState, useEffect } from "react";
import "./EmotionForm.css";
import { useAuth } from "./auth/AuthContext";
import { useEmotions } from "./EmotionsContext";

const EmotionForm = ({ selectedCoords, onAdd, onClose, editPoint, setEditPoint }) => {
  const [text, setText] = useState("");
  const [selectedEmotion, setSelectedEmotion] = useState("auto");
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const { currentUser } = useAuth();
  const { emotions, loading } = useEmotions();

  useEffect(() => {
    if (editPoint) {
      setText(editPoint.text);
      setSelectedEmotion("auto");
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
      label = selectedEmotion;
      score = 1.0;

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
      }
    } else {
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
      if (selectedEmotion === "auto") {
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
          <div className="selector-with-tooltip">
            <select 
              id="emotion-selector" 
              value={selectedEmotion} 
              onChange={(e) => setSelectedEmotion(e.target.value)}
              className="emotion-selector"
            >
              {getEmotionOptions()}
            </select>            <div 
              className="info-icon" 
              onMouseEnter={() => setTooltipVisible(true)}              onMouseLeave={() => setTooltipVisible(false)}
            >
              <span style={{ display: 'inline-block', lineHeight: '20px' }}>?</span>              {tooltipVisible && (
                <div className="tooltip-box">
                  <p><strong>Auto (Analyze):</strong> Using auto you use Naive Bayes algorithm. It calculates a probability of all emotions based on your words and takes the highest one.</p>
                  <p><strong>Manual selection:</strong> Choose an emotion manually to help train the AI.</p>
                  <p>When you select an emotion manually, it helps our AI learn and improve!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <button className="emotion-button" onClick={handleSubmit}>
          {editPoint ? "Update" : (selectedEmotion === "auto" ? "Add & Analyze" : "Add & Train")}
        </button>
      </div>
    </div>
  );
};

export default EmotionForm;
