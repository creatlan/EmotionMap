import React, { useState, useEffect } from "react";
import "./EmotionForm.css";

const EmotionForm = ({ selectedCoords, onAdd, onClose, editPoint, setEditPoint }) => {
  const [text, setText] = useState("");

  useEffect(() => {
    if (editPoint) {
      setText(editPoint.text);
    } else {
      setText("");
    }
  }, [editPoint]);

  const handleSubmit = async () => {
    if (!selectedCoords || !text.trim()) return;

    const res = await fetch("http://localhost:8000/points", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: editPoint?.username || "test_user",
        text,
        coords: selectedCoords,
      }),
    });

    if (!res.ok) {
      alert("Error while analyzing emotion");
      return;
    }

    const data = await res.json();

    const newPoint = {
      ...editPoint,
      text,
      coords: selectedCoords,
      label: data.label,
      score: data.score,
      timestamp: new Date().toISOString(),
    };

    // если редактируем — удаляем старую точку
    if (editPoint?._id) {
      await fetch(`http://localhost:8001/points/${editPoint._id}`, {
        method: "DELETE",
      });
    }

    onAdd(newPoint);
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
