import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ReactComponent as Logo } from "../assets/logo.svg";
import { useAuth } from "../auth/AuthContext";
import "./Header.css";

const Header = () => {
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const handleLogout = () => {
    try {
      logout();
      setShowMenu(false);
      navigate('/login');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

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
        {currentUser ? (
          <div className="user-menu-container">
            <button 
              className={`nav-btn user-btn ${location.pathname === "/login" ? "active" : ""}`}
              onClick={() => setShowMenu(!showMenu)}
            >
              <span style={{ fontSize: '16px', marginRight: '4px' }}>👤</span>
              {currentUser.username}
            </button>            {showMenu && (
              <div className="user-dropdown">
                <button 
                  onClick={handleLogout} 
                  className="dropdown-item"
                  type="button"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" 
            className={`nav-btn ${location.pathname === "/login" ? "active" : ""}`}
          >
            Sign in
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Header;
