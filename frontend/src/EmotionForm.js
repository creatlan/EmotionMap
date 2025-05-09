import React, { useState, useEffect } from "react";
import "./EmotionForm.css";
import { useAuth } from "./auth/AuthContext";

const EmotionForm = ({ selectedCoords, onAdd, onClose, editPoint, setEditPoint }) => {
  const [text, setText] = useState("");
  const { currentUser } = useAuth();

  useEffect(() => {
    if (editPoint) {
      setText(editPoint.text);
    } else {
      setText("");
    }
  }, [editPoint]);

  const handleSubmit = async () => {
    if (!selectedCoords || !text.trim()) return;
    const timestamp = new Date().toISOString();
    console.log("editPoint value:", editPoint);
    console.log("editPoint._id value:", editPoint?._id);
    if (editPoint?._id) {
      // Edit existing point: analyze without creating a new DB entry
      const analyzeRes = await fetch("http://localhost:8000/models/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: editPoint.username,
          text,
          coords: selectedCoords
        })
      });
      if (!analyzeRes.ok) {
        alert("Error while analyzing emotion");
        return;
      }
      const { label, score } = await analyzeRes.json();
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
          id: editPoint._id, // Ensure _id is included in the payload
          text,
          coords: selectedCoords,
          label,
          score,
          timestamp
        })
      });
      console.log("Update response status:", updateRes.status);
      if (!updateRes.ok) {
        alert("Error while updating point");
        return;
      }
      onAdd({ ...editPoint, text, coords: selectedCoords, label, score, timestamp });
    } else {
      // Create new point: analyze and add via ML service
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
      console.log("Create response status:", res.status);
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
    }
    setText("");
    setEditPoint(null);
    onClose?.();
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
        <button className="emotion-button" onClick={handleSubmit}>
          {editPoint ? "Update" : "Add & Analyse"}
        </button>
      </div>
    </div>
  );
};

export default EmotionForm;
