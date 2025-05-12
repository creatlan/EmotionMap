import React from "react";
import "./AboutScreen.css";
import Header from "../components/Header";
import img1 from "../assets/about1.png";
import img2 from "../assets/about2.png";
import img3 from "../assets/about3.png";

const sections = [
  {
    title: "Your Emotions, Mapped.",
    subtitle: "We believe every place has a feeling.",
    text: `EmotionMap allows people to attach emotions to places—revealing what we feel where. By blending psychology and machine learning, we don't just analyze text. We map the human experience.`,
    image: img1
  },
  {
    title: "Psychologically Grounded.",
    subtitle: "Based on proven emotion models.",
    text: `We use emotion classification models grounded in the psychology of affect. From joy to sadness, from awe to fear—we analyze language and context to predict what you feel.`,
    image: img2
  },
  {
    title: "Designed for Reflection.",
    subtitle: "And self-discovery.",
    text: `This map is yours. See where you've felt alive, calm, frustrated or free. Zoom out and find collective emotional landscapes shaped by communities.`,
    image: img3
  }
];

const AboutScreen = () => {
  return (
    <div className="about-container">
      <Header />
      {sections.map((sec, idx) => (
        <section key={idx} className="about-section">
          <div className="text-block">
            <h1 className="section-title">{sec.title}</h1>
            <h3 className="section-subtitle">{sec.subtitle}</h3>
            <p className="section-text">{sec.text}</p>
          </div>
          <div className="image-block">
            <img src={sec.image} alt={sec.title} />
          </div>
        </section>
      ))}
    </div>
  );
};

export default AboutScreen;
