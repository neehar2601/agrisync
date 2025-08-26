// Yield management service
import apiService from '../../shared/services/apiService';

class YieldService {
  async getYields() {
    try {
      const response = await apiService.get('/yields');
      return response;
    } catch (error) {
      throw new Error('Failed to fetch yields data');
    }
  }

  async addYield(yieldData) {
    try {
      const response = await apiService.post('/yields', yieldData);
      return response;
    } catch (error) {
      throw new Error('Failed to add yield');
    }
  }

  async getSales() {
    try {
      const response = await apiService.get('/sales');
      return response;
    } catch (error) {
      throw new Error('Failed to fetch sales data');
    }
  }

  async recordSale(saleData) {
    try {
      const response = await apiService.post('/sales', saleData);
      return response;
    } catch (error) {
      throw new Error('Failed to record sale');
    }
  }
}

export default new YieldService();
