// Worker management service
import apiService from '../../shared/services/apiService';

class WorkerService {
  async getWorkers() {
    try {
      const response = await apiService.get('/workers');
      return response;
    } catch (error) {
      throw new Error('Failed to fetch workers data');
    }
  }

  async addWorker(workerData) {
    try {
      const response = await apiService.post('/workers', workerData);
      return response;
    } catch (error) {
      throw new Error('Failed to add worker');
    }
  }

  async getWorkerDetails(workerId) {
    try {
      const response = await apiService.get(`/workers/${workerId}`);
      return response;
    } catch (error) {
      throw new Error('Failed to fetch worker details');
    }
  }

  async markAttendance(workerId, attendanceData) {
    try {
      const response = await apiService.post(`/workers/${workerId}/attendance`, attendanceData);
      return response;
    } catch (error) {
      throw new Error('Failed to mark attendance');
    }
  }

  async addLoan(workerId, loanData) {
    try {
      const response = await apiService.post(`/workers/${workerId}/loan`, loanData);
      return response;
    } catch (error) {
      throw new Error('Failed to add loan');
    }
  }

  async calculatePayroll(workerId, payrollData) {
    try {
      const response = await apiService.post(`/workers/${workerId}/payroll`, payrollData);
      return response;
    } catch (error) {
      throw new Error('Failed to calculate payroll');
    }
  }
}

export default new WorkerService();
