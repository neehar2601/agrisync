// Financial analytics service
import apiService from '../../shared/services/apiService';

class FinancialService {
  async getFinancials() {
    try {
      const response = await apiService.get('/financials');
      return response;
    } catch (error) {
      throw new Error('Failed to fetch financial data');
    }
  }

  async addRevenue(revenueData) {
    try {
      const response = await apiService.post('/financials/revenue', revenueData);
      return response;
    } catch (error) {
      throw new Error('Failed to add revenue');
    }
  }

  async addExpense(expenseData) {
    try {
      const response = await apiService.post('/financials/expense', expenseData);
      return response;
    } catch (error) {
      throw new Error('Failed to add expense');
    }
  }
}

export default new FinancialService();
