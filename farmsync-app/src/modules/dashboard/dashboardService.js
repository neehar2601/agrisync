// Dashboard service
import apiService from '../../shared/services/apiService';

class DashboardService {
  async getDashboardData() {
    try {
      const response = await apiService.get('/dashboard');
      return response;
    } catch (error) {
      throw new Error('Failed to fetch dashboard data');
    }
  }
}

export default new DashboardService();
