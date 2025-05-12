import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "./LoginScreen.css";

const LoginScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        // Login logic
        await login(username, password);
      } else {
        // Register logic
        await register(username, password);
      }
      // Redirect to home page after successful login/register
      navigate("/");
    } catch (err) {
      console.error("Auth error:", err);
      setError(err.message || `Failed to ${isLogin ? 'login' : 'register'}`);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="login-screen">
      <div className="login-container">
        <h2>{isLogin ? "Login" : "Register"}</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? "Processing..." : isLogin ? "Login" : "Register"}
          </button>
        </form>
          <div className="toggle-form">
          <p>
            {isLogin 
              ? "Don't have an account?" 
              : "Already have an account?"}
            <button 
              className="toggle-button"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Register" : "Login"}
            </button>
          </p>
          <p style={{ marginTop: "15px", fontSize: "13px" }}>
            <Link to="/" style={{ color: "#3a5683", textDecoration: "none" }}>
              Return to home page
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
