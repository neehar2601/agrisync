import React, { useState } from 'react';
import { formatCurrency, formatDate } from '../../../utils/formatters';

const WorkerDetails = ({ worker, attendance, loans, onMarkAttendance, onUpdateLoan, onCalculatePay, onNavigate }) => {
  const [loanAmount, setLoanAmount] = useState('');
  const [loanDescription, setLoanDescription] = useState('');
  const [deductAmount, setDeductAmount] = useState('');
  const [payStatus, setPayStatus] = useState(null);

  const daysInMonth = (year, month) => new Date(year, month, 0).getDate();
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const handleMarkAttendance = (day) => {
    const date = new Date(currentYear, currentMonth, day).toISOString().slice(0, 10);
    const status = attendance[date]?.status === 'Present' ? 'Absent' : 'Present';
    const hours = status === 'Present' ? 8 : 0; // Default to 8 hours for daily pay
    onMarkAttendance(worker.id, date, status, hours);
  };

  const handleMarkHourlyAttendance = (day, hours) => {
    const date = new Date(currentYear, currentMonth, day).toISOString().slice(0, 10);
    const status = hours > 0 ? 'Present' : 'Absent';
    onMarkAttendance(worker.id, date, status, hours);
  };

  const handleAddLoan = async () => {
    if (loanAmount && loanDescription) {
      await onUpdateLoan(worker.id, loanAmount, loanDescription, 'loan');
      setLoanAmount('');
      setLoanDescription('');
    }
  };

  const handleCalculatePay = async () => {
    await onCalculatePay(worker.id, deductAmount);
    // You could fetch updated data here or handle the state change
  };

  return (
    <div className="p-8 space-y-8">
      <button onClick={() => onNavigate('workers')} className="text-gray-500 hover:text-gray-700 mb-4">&lt; Back to Workers</button>
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-2xl font-bold mb-4">{worker.name}</h3>
        <p className="text-gray-600">Role: {worker.role}</p>
        <p className="text-gray-600">Pay Type: {worker.payType}</p>
        <p className="text-gray-600">Pay Rate: {formatCurrency(worker.payRate)}</p>
        <p className="text-gray-600 font-semibold mt-2">Current Loan Balance: {formatCurrency(worker.loans)}</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-xl font-bold mb-4">Attendance Tracking</h3>
        <div className="grid grid-cols-7 gap-4 text-center text-sm">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="font-bold text-gray-700">{day}</div>
          ))}
          {Array.from({ length: new Date(currentYear, currentMonth, 1).getDay() }).map((_, i) => <div key={`empty-${i}`} className="p-2"></div>)}
          {Array.from({ length: daysInMonth(currentYear, currentMonth + 1) }).map((_, day) => {
            const date = new Date(currentYear, currentMonth, day + 1).toISOString().slice(0, 10);
            const status = attendance[date]?.status;
            const hours = attendance[date]?.hours;
            return (
              <div key={day + 1} className={`p-2 rounded-lg cursor-pointer transition-all duration-200 ${status === 'Present' ? 'bg-green-200 text-green-800' : status === 'Absent' ? 'bg-red-200 text-red-800' : 'bg-gray-100 hover:bg-gray-200'}`} onClick={() => handleMarkAttendance(day + 1)}>
                <div className="font-semibold text-lg">{day + 1}</div>
                {status && <span className="text-xs">{status}</span>}
                {worker.payType === 'Hourly' && status === 'Present' && (
                  <input
                    type="number"
                    value={hours}
                    onChange={(e) => handleMarkHourlyAttendance(day + 1, parseInt(e.target.value) || 0)}
                    className="w-10 text-center mt-1 border rounded"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg space-y-4">
          <h3 className="text-xl font-bold mb-4">Loan Management</h3>
          <div>
            <label className="block text-gray-700">Loan Amount (₹)</label>
            <input 
              type="number" 
              value={loanAmount} 
              onChange={(e) => setLoanAmount(e.target.value)} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" 
            />
          </div>
          <div>
            <label className="block text-gray-700">Description</label>
            <input 
              type="text" 
              value={loanDescription} 
              onChange={(e) => setLoanDescription(e.target.value)} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" 
            />
          </div>
          <button onClick={handleAddLoan} className="w-full bg-blue-500 text-white p-3 rounded-xl shadow-md hover:bg-blue-600 transition">
            Add Loan
          </button>
          
          <div className="mt-6">
            <h4 className="font-semibold mb-2">Loan History</h4>
            <ul className="space-y-2">
              {loans.map((loan, index) => (
                <li key={index} className="flex justify-between items-center p-2 bg-gray-100 rounded-lg">
                  <span>{formatDate(loan.date)} - {loan.description}</span>
                  <span className={`${loan.amount > 0 ? 'text-red-500' : 'text-green-500'}`}>{formatCurrency(loan.amount)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg space-y-4">
          <h3 className="text-xl font-bold mb-4">Calculate & Pay Salary</h3>
          <div>
            <label className="block text-gray-700">Loan Deduction (₹)</label>
            <input 
              type="number" 
              value={deductAmount} 
              onChange={(e) => setDeductAmount(e.target.value)} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" 
            />
          </div>
          <button onClick={handleCalculatePay} className="w-full bg-green-500 text-white p-3 rounded-xl shadow-md hover:bg-green-600 transition">
            Calculate & Pay
          </button>

          {payStatus && (
            <div className="mt-6 p-4 bg-green-100 rounded-lg">
              <h4 className="font-semibold text-green-800">Payment Summary</h4>
              <p>Total Pay: {formatCurrency(payStatus.totalPay)}</p>
              <p>Loan Deduction: {formatCurrency(payStatus.deduction)}</p>
              <p className="font-bold text-lg mt-2">Net Pay: {formatCurrency(payStatus.netPay)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkerDetails;
