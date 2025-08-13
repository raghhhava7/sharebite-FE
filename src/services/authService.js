import { api } from './api';

export const authService = {
  // User registration
  signup: async (userData) => {
    try {
      const response = await api.auth.register(userData);
      return response;
    } catch (error) {
      throw error.message || 'Registration failed';
    }
  },

  // User login
  login: async (credentials) => {
    try {
      const response = await api.auth.login(credentials);
      return response;
    } catch (error) {
      throw error.message || 'Login failed';
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      // Use direct API request since profile endpoint isn't in the api object
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('sharebite_token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      throw error.message || 'Failed to get profile';
    }
  },

  // Logout (client-side only)
  logout: () => {
    localStorage.removeItem('sharebite_token');
    localStorage.removeItem('sharebite_user');
  }
};