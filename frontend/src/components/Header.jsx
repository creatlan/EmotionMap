import React from "react";
import { Link, useLocation  } from "react-router-dom";
import { ReactComponent as Logo } from "../assets/logo.svg";
import "./Header.css";

const Header = () => {
  const location = useLocation();

  return (
    <nav className="nav-bar">
      <div className="logo">
        <Logo />
      </div>
      <div className="nav-buttons">
        <Link to="/" 
        className={`nav-btn ${location.pathname === "/" ? "active" : ""}`}
        >Map</Link>
        <Link to="/about" 
        className={`nav-btn ${location.pathname === "/about" ? "active" : ""}`}
        >About</Link>
        <Link to="/login" 
        className={`nav-btn ${location.pathname === "/login" ? "active" : ""}`}
        >Sign in</Link>
      </div>
    </nav>
  );
};

export default Header;
