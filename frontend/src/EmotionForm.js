import React, { useState } from "react";

const EmotionForm = ({ selectedCoords, onAdd }) => {
  const [text, setText] = useState("");

  const handleSubmit = async () => {
    if (!selectedCoords || !text) return;

    const res = await fetch("http://localhost:8000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        coords: selectedCoords
      }),
    });

    const data = await res.json();
    const point = {
      ...data,
      text,
      coords: selectedCoords,
    };
    onAdd(point);
    setText("");
  };

  return (
    <div style={{ padding: "1rem" }}>
      <textarea
        rows="4"
        placeholder="Describe your emotion..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <br />
      <button onClick={handleSubmit}>Analyse your emotion</button>
    </div>
  );
};

export default EmotionForm;
