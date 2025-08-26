// Authentication service
import apiService from '../../shared/services/apiService';

class AuthService {
  async login(email, password) {
    try {
      const response = await apiService.post('/auth/login', { email, password });
      if (response.userId) {
        localStorage.setItem('userId', response.userId);
        localStorage.setItem('isAuthenticated', 'true');
      }
      return response;
    } catch (error) {
      throw new Error('Login failed. Please check your credentials.');
    }
  }

  async register(userData) {
    try {
      const response = await apiService.post('/auth/register', userData);
      return response;
    } catch (error) {
      throw new Error('Registration failed. Please try again.');
    }
  }

  async getCurrentUserId() {
    try {
      const response = await apiService.get('/auth/user-id');
      return response.userId;
    } catch (error) {
      throw new Error('Failed to get user information.');
    }
  }

  logout() {
    localStorage.removeItem('userId');
    localStorage.removeItem('isAuthenticated');
  }

  isAuthenticated() {
    return localStorage.getItem('isAuthenticated') === 'true';
  }

  getCurrentUser() {
    return localStorage.getItem('userId');
  }
}

export default new AuthService();
