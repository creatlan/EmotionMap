// MongoDB service authentication API
const API_URL = 'http://localhost:8001';

export const loginUser = async (username, password) => {
  try {
    const response = await fetch(`${API_URL}/users/${username}?password=${password}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('User not found');
      } else if (response.status === 401) {
        throw new Error('Invalid password');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }
    }
    
    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const registerUser = async (username, password) => {
  try {
    const response = await fetch(`${API_URL}/users/${username}?password=${password}`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      if (response.status === 400) {
        throw new Error('User already exists');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Registration failed');
      }
    }
    
    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const checkAuth = async (username) => {
  try {
    const response = await fetch(`${API_URL}/users/${username}`);
    if (!response.ok) {
      return false;
    }
    return true;
  } catch (error) {
    console.error('Auth check error:', error);
    return false;
  }
};