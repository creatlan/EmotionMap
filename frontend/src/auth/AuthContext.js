import React, { createContext, useState, useEffect, useContext } from 'react';
import { loginUser, registerUser, checkAuth } from './api';

// Create the Authentication Context
const AuthContext = createContext();

// Hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          
          // Check if auth session is still valid
          const isValid = await checkAuth(userData.username);
          
          if (isValid) {
            setCurrentUser(userData);
          } else {
            // If the token is invalid, remove it
            localStorage.removeItem('user');
            setCurrentUser(null);
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        localStorage.removeItem('user');
        setCurrentUser(null);
        setError('Failed to restore authentication state');
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Login function
  const login = async (username, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const userData = await loginUser(username, password);
      
      // Save user data to localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      setCurrentUser(userData);
      return userData;
    } catch (err) {
      setError(err.message || 'Failed to login');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  // Register function
  const register = async (username, password) => {
    try {
      setLoading(true);
      setError(null);
      
      await registerUser(username, password);
      
      // After registration, log the user in
      return await login(username, password);
    } catch (err) {
      setError(err.message || 'Failed to register');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  // Auth context value
  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;