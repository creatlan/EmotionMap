import React from 'react';
import './Login.css'; // Assuming a CSS file for styling

function Login() {
  return (
    <div className="login-container">
      <h2>Login</h2>
      <form>
        <input
          type="text"
          className="login-input" // Add a class for consistent styling
          placeholder="Username"
        />
        <input
          type="password"
          className="login-input" // Add a class for consistent styling
          placeholder="Password"
        />
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;