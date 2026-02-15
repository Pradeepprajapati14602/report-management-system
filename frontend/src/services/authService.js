import apiClient from './apiService';

export const authService = {
  /**
   * Login user with email and password
   */
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      // Throw error with response data if available
      if (error.response) {
        throw error.response.data;
      }
      throw error;
    }
  },

  /**
   * Register a new user
   */
  register: async (email, password) => {
    try {
      const response = await apiClient.post('/users', {
        email,
        password,
        role: 'USER',
      });
      return response.data;
    } catch (error) {
      // Throw error with response data if available
      if (error.response) {
        throw error.response.data;
      }
      throw error;
    }
  },
};
