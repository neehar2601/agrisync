// Worker details component
import React, { useState, useEffect } from 'react';
import { Card, LoadingCard, ErrorCard } from '../../shared/components/Card';
import { Button, FormField } from '../../shared/components/Form';
import { formatCurrency, formatDate } from '../../shared/utils/formatters';
import { ATTENDANCE_STATUS } from '../../shared/utils/constants';
import workerService from './workerService';

const WorkerDetails = ({ workerId, onBack }) => {
  const [worker, setWorker] = useState(null);
  const [attendance, setAttendance] = useState({});
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form states
  const [loanForm, setLoanForm] = useState({ amount: '', description: '' });
  const [payrollForm, setPayrollForm] = useState({ deduction: '' });
  const [payStatus, setPayStatus] = useState(null);

  const fetchWorkerDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await workerService.getWorkerDetails(workerId);
      setWorker(data.worker);
      setAttendance(data.attendance);
      setLoans(data.loans);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (workerId) {
      fetchWorkerDetails();
    }
  }, [workerId]);

  const handleMarkAttendance = async (day) => {
    const today = new Date();
    const date = new Date(today.getFullYear(), today.getMonth(), day).toISOString().slice(0, 10);
    const currentStatus = attendance[date]?.status;
    const newStatus = currentStatus === ATTENDANCE_STATUS.PRESENT ? ATTENDANCE_STATUS.ABSENT : ATTENDANCE_STATUS.PRESENT;
    const hours = newStatus === ATTENDANCE_STATUS.PRESENT ? 8 : 0;

    try {
      await workerService.markAttendance(workerId, { date, status: newStatus, hours });
      await fetchWorkerDetails();
    } catch (error) {
      console.error('Error marking attendance:', error);
    }
  };

  const handleAddLoan = async (e) => {
    e.preventDefault();
    try {
      await workerService.addLoan(workerId, loanForm);
      setLoanForm({ amount: '', description: '' });
      await fetchWorkerDetails();
    } catch (error) {
      console.error('Error adding loan:', error);
    }
  };

  const handleCalculatePayroll = async (e) => {
    e.preventDefault();
    try {
      const result = await workerService.calculatePayroll(workerId, { deduction: payrollForm.deduction });
      setPayStatus(result);
      await fetchWorkerDetails();
    } catch (error) {
      console.error('Error calculating payroll:', error);
    }
  };

  const renderAttendanceCalendar = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    return (
      <Card title="Attendance Tracking">
        <div className="grid grid-cols-7 gap-4 text-center text-sm">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="font-bold text-gray-700">{day}</div>
          ))}
          
          {/* Empty cells for days before the first day of the month */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="p-2"></div>
          ))}
          
          {/* Days of the month */}
          {Array.from({ length: daysInMonth }).map((_, day) => {
            const date = new Date(currentYear, currentMonth, day + 1).toISOString().slice(0, 10);
            const dayAttendance = attendance[date];
            const status = dayAttendance?.status;
            
            let bgColor = 'bg-gray-100 hover:bg-gray-200';
            if (status === ATTENDANCE_STATUS.PRESENT) {
              bgColor = 'bg-green-200 text-green-800';
            } else if (status === ATTENDANCE_STATUS.ABSENT) {
              bgColor = 'bg-red-200 text-red-800';
            }

            return (
              <div
                key={day + 1}
                className={`p-2 rounded-lg cursor-pointer transition-all duration-200 ${bgColor}`}
                onClick={() => handleMarkAttendance(day + 1)}
              >
                <div className="font-semibold text-lg">{day + 1}</div>
                {status && <span className="text-xs">{status}</span>}
                {worker?.payType === 'Hourly' && status === ATTENDANCE_STATUS.PRESENT && (
                  <div className="text-xs mt-1">{dayAttendance.hours}h</div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="p-8">
        <LoadingCard message="Loading worker details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <ErrorCard message={error} onRetry={fetchWorkerDetails} />
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="p-8">
        <ErrorCard message="Worker not found" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <button 
        onClick={onBack}
        className="text-gray-500 hover:text-gray-700 mb-4"
      >
        &lt; Back to Workers
      </button>

      {/* Worker Info */}
      <Card>
        <h3 className="text-2xl font-bold mb-4">{worker.name}</h3>
        <div className="grid grid-cols-2 gap-4 text-gray-600">
          <p>Role: {worker.role}</p>
          <p>Pay Type: {worker.payType}</p>
          <p>Pay Rate: {formatCurrency(worker.payRate)}</p>
          <p className="font-semibold">Current Loan Balance: {formatCurrency(worker.loans)}</p>
        </div>
      </Card>

      {/* Attendance Calendar */}
      {renderAttendanceCalendar()}

      {/* Loan Management and Payroll */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Loan Management */}
        <Card title="Loan Management">
          <form onSubmit={handleAddLoan} className="space-y-4 mb-6">
            <FormField
              label="Loan Amount (₹)"
              type="number"
              value={loanForm.amount}
              onChange={(e) => setLoanForm(prev => ({ ...prev, amount: e.target.value }))}
              required
              min="0"
              step="0.01"
            />
            <FormField
              label="Description"
              value={loanForm.description}
              onChange={(e) => setLoanForm(prev => ({ ...prev, description: e.target.value }))}
              required
            />
            <Button type="submit" variant="secondary" className="w-full">
              Add Loan
            </Button>
          </form>

          <div>
            <h4 className="font-semibold mb-2">Loan History</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {loans.map((loan, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-100 rounded-lg">
                  <span className="text-sm">{formatDate(loan.date)} - {loan.description}</span>
                  <span className={`text-sm font-medium ${loan.amount > 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {formatCurrency(loan.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Payroll */}
        <Card title="Calculate & Pay Salary">
          <form onSubmit={handleCalculatePayroll} className="space-y-4">
            <FormField
              label="Loan Deduction (₹)"
              type="number"
              value={payrollForm.deduction}
              onChange={(e) => setPayrollForm(prev => ({ ...prev, deduction: e.target.value }))}
              min="0"
              step="0.01"
            />
            <Button type="submit" className="w-full">
              Calculate & Pay
            </Button>
          </form>

          {payStatus && (
            <div className="mt-6 p-4 bg-green-100 rounded-lg">
              <h4 className="font-semibold text-green-800">Payment Summary</h4>
              <p>Total Pay: {formatCurrency(payStatus.totalPay)}</p>
              <p>Loan Deduction: {formatCurrency(payStatus.deduction)}</p>
              <p className="font-bold text-lg mt-2">Net Pay: {formatCurrency(payStatus.netPay)}</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default WorkerDetails;
