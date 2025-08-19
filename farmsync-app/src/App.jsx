import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, BarChart, Bar, ResponsiveContainer } from 'recharts';

// Helper function to format numbers as Indian Rupees
const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) {
    return '₹0';
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

// Helper function for date formatting
const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe'];

// Sidebar Navigation Component
const Sidebar = ({ activePage, onNavigate }) => (
  <nav className="flex flex-col bg-gray-800 text-white w-64 p-4 min-h-screen rounded-2xl shadow-xl">
    <div className="flex items-center space-x-2 text-xl font-bold mb-8 text-green-400">
      <span className="text-3xl">🌱</span>
      <span>FarmSync</span>
    </div>
    <ul className="space-y-2">
      <li className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${activePage === 'dashboard' ? 'bg-green-600' : 'hover:bg-gray-700'}`} onClick={() => onNavigate('dashboard')}>
        <span className="text-xl">🏠</span>
        <span>Dashboard</span>
      </li>
      <li className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${activePage === 'yields' ? 'bg-green-600' : 'hover:bg-gray-700'}`} onClick={() => onNavigate('yields')}>
        <span className="text-xl">🌾</span>
        <span>Yields & Sales</span>
      </li>
      <li className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${activePage === 'workers' ? 'bg-green-600' : 'hover:bg-gray-700'}`} onClick={() => onNavigate('workers')}>
        <span className="text-xl">👨‍🌾</span>
        <span>Worker Management</span>
      </li>
      <li className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${activePage === 'financials' ? 'bg-green-600' : 'hover:bg-gray-700'}`} onClick={() => onNavigate('financials')}>
        <span className="text-xl">💰</span>
        <span>Financials</span>
      </li>
      <li className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${activePage === 'inventory' ? 'bg-green-600' : 'hover:bg-gray-700'}`} onClick={() => onNavigate('inventory')}>
        <span className="text-xl">📦</span>
        <span>Inventory</span>
      </li>
      <li className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${activePage === 'reports' ? 'bg-green-600' : 'hover:bg-gray-700'}`} onClick={() => onNavigate('reports')}>
        <span className="text-xl">📈</span>
        <span>Reports & Analytics</span>
      </li>
    </ul>
    <div className="mt-auto pt-4 border-t border-gray-700">
      <button className="flex items-center space-x-3 p-3 w-full rounded-lg cursor-pointer text-red-400 hover:bg-gray-700 transition-all duration-200">
        <span className="text-xl">🚪</span>
        <span>Logout</span>
      </button>
    </div>
  </nav>
);

// Top Bar Component
const TopBar = ({ title, userId }) => (
  <header className="flex items-center justify-between bg-white p-4 shadow-sm rounded-t-2xl">
    <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2 text-gray-600">
        <span className="text-xl">👤</span>
        <span>User ID: {userId}</span>
      </div>
      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center font-bold text-gray-700">
        FS
      </div>
    </div>
  </header>
);

// Dashboard Page
const Dashboard = ({ data }) => (
  <div className="p-8 space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-500">Total Revenue</h3>
          <p className="text-3xl font-bold text-green-600">{formatCurrency(data.financialSummary.totalRevenue)}</p>
        </div>
        <span className="text-4xl">💲</span>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-500">Total Expenses</h3>
          <p className="text-3xl font-bold text-red-600">{formatCurrency(data.financialSummary.totalExpenses)}</p>
        </div>
        <span className="text-4xl">💸</span>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-500">Total Yield</h3>
          <p className="text-3xl font-bold text-yellow-600">{data.metrics.totalYield} kg</p>
        </div>
        <span className="text-4xl">🌾</span>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-500">Active Workers</h3>
          <p className="text-3xl font-bold text-blue-600">{data.metrics.activeWorkers}</p>
        </div>
        <span className="text-4xl">👥</span>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-xl font-bold mb-4">Financial Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.financialTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#82ca9d" name="Revenue" />
            <Line type="monotone" dataKey="expenses" stroke="#ff7300" name="Expenses" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg space-y-4">
        <h3 className="text-xl font-bold">Weather Data (Mock)</h3>
        <div className="flex items-center justify-between text-lg">
          <div className="flex flex-col items-center">
            <span className="text-4xl">☀️</span>
            <span className="mt-2 text-gray-600">{data.weather.condition}</span>
          </div>
          <div className="text-center">
            <span className="text-4xl font-bold">{data.weather.temp}</span>
            <p className="text-gray-500">Current Temp</p>
          </div>
        </div>
        <div className="flex justify-around text-center">
          <div>
            <p className="text-lg font-semibold">{data.weather.windSpeed}</p>
            <p className="text-sm text-gray-500">Wind Speed</p>
          </div>
          <div>
            <p className="text-lg font-semibold">{data.weather.humidity}</p>
            <p className="text-sm text-gray-500">Humidity</p>
          </div>
        </div>
        <button className="w-full bg-green-500 text-white p-3 rounded-xl shadow-md hover:bg-green-600 transition">
          {data.weather.forecast}
        </button>
      </div>
    </div>
  </div>
);

// Yields & Sales Tracking Page
const YieldsSales = ({ data, onRecordSale, onAddYield }) => {
  const [newYield, setNewYield] = useState({ name: '', quantity: '', unit: 'kg' });
  const [newSale, setNewSale] = useState({ cropId: '', quantity: '', price: '', seller: '' });

  const handleAddYield = (e) => {
    e.preventDefault();
    onAddYield(newYield);
    setNewYield({ name: '', quantity: '', unit: 'kg' });
  };

  const handleRecordSale = (e) => {
    e.preventDefault();
    onRecordSale(newSale);
    setNewSale({ cropId: '', quantity: '', price: '', seller: '' });
  };

  return (
    <div className="p-8 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg space-y-4">
          <h3 className="text-xl font-bold mb-4">Add New Yield</h3>
          <form onSubmit={handleAddYield} className="space-y-4">
            <div>
              <label className="block text-gray-700">Crop Name</label>
              <input type="text" value={newYield.name} onChange={(e) => setNewYield({ ...newYield, name: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" required />
            </div>
            <div>
              <label className="block text-gray-700">Quantity</label>
              <input type="number" value={newYield.quantity} onChange={(e) => setNewYield({ ...newYield, quantity: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" required />
            </div>
            <div>
              <label className="block text-gray-700">Unit</label>
              <select value={newYield.unit} onChange={(e) => setNewYield({ ...newYield, unit: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500">
                <option value="kg">kg</option>
                <option value="count">count</option>
                <option value="tons">tons</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-green-500 text-white p-3 rounded-xl shadow-md hover:bg-green-600 transition">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-xl">➕</span>
                <span>Add Yield</span>
              </div>
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg space-y-4">
          <h3 className="text-xl font-bold mb-4">Record a Sale</h3>
          <form onSubmit={handleRecordSale} className="space-y-4">
            <div>
              <label className="block text-gray-700">Select Crop</label>
              <select value={newSale.cropId} onChange={(e) => setNewSale({ ...newSale, cropId: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" required>
                <option value="">-- Select a crop --</option>
                {data.yields.map(crop => (
                  <option key={crop.id} value={crop.id}>{crop.cropName} ({crop.quantity} {crop.unit})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700">Quantity Sold</label>
              <input type="number" value={newSale.quantity} onChange={(e) => setNewSale({ ...newSale, quantity: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" required />
            </div>
            <div>
              <label className="block text-gray-700">Selling Price (₹)</label>
              <input type="number" value={newSale.price} onChange={(e) => setNewSale({ ...newSale, price: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" required />
            </div>
            <div>
              <label className="block text-gray-700">Seller Name</label>
              <input type="text" value={newSale.seller} onChange={(e) => setNewSale({ ...newSale, seller: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" required />
            </div>
            <button type="submit" className="w-full bg-green-500 text-white p-3 rounded-xl shadow-md hover:bg-green-600 transition">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-xl">📋</span>
                <span>Record Sale</span>
              </div>
            </button>
          </form>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-xl font-bold mb-4">Yields & Sales History</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-gray-600">Date</th>
                <th className="px-4 py-2 text-left text-gray-600">Crop Name</th>
                <th className="px-4 py-2 text-left text-gray-600">Quantity Sold</th>
                <th className="px-4 py-2 text-left text-gray-600">Price</th>
                <th className="px-4 py-2 text-left text-gray-600">Seller</th>
              </tr>
            </thead>
            <tbody>
              {data.sales.map((sale) => (
                <tr key={sale.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-2">{formatDate(sale.date)}</td>
                  <td className="px-4 py-2">{sale.cropName}</td>
                  <td className="px-4 py-2">{sale.quantity} kg</td>
                  <td className="px-4 py-2">{formatCurrency(sale.price)}</td>
                  <td className="px-4 py-2">{sale.seller}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Worker Management Page
const WorkerManagement = ({ data, onAddWorker, onNavigate }) => {
  const handleAddWorker = (e) => {
    e.preventDefault();
    // This is a dummy call for the frontend
    onAddWorker({ name: 'New Worker', role: 'Test', payRate: 100, payType: 'Daily', active: true, loans: 0 });
  };

  return (
    <div className="p-8 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-500">Total Workers</h3>
            <p className="text-3xl font-bold text-gray-800">{data.workers.length}</p>
          </div>
          <span className="text-4xl">👥</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-500">Active Workers</h3>
            <p className="text-3xl font-bold text-green-600">{data.workers.filter(w => w.active).length}</p>
          </div>
          <span className="text-4xl">✅</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-500">Pending Payments</h3>
            <p className="text-3xl font-bold text-yellow-600">{formatCurrency(data.workers.reduce((sum, w) => sum + w.loans, 0))}</p>
          </div>
          <span className="text-4xl">⏳</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-500">Loan Balances</h3>
            <p className="text-3xl font-bold text-red-600">{formatCurrency(data.workers.reduce((sum, w) => sum + w.loans, 0))}</p>
          </div>
          <span className="text-4xl">💸</span>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Worker List</h3>
          <button onClick={handleAddWorker} className="bg-green-500 text-white p-3 rounded-xl shadow-md hover:bg-green-600 transition">
            <div className="flex items-center space-x-2">
              <span className="text-xl">➕</span>
              <span>Add New Worker</span>
            </div>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-gray-600">Name</th>
                <th className="px-4 py-2 text-left text-gray-600">Role</th>
                <th className="px-4 py-2 text-left text-gray-600">Pay Type</th>
                <th className="px-4 py-2 text-left text-gray-600">Pay Rate</th>
                <th className="px-4 py-2 text-left text-gray-600">Loan Balance</th>
                <th className="px-4 py-2 text-left text-gray-600">Status</th>
                <th className="px-4 py-2 text-left text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.workers.map((worker) => (
                <tr key={worker.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-2">{worker.name}</td>
                  <td className="px-4 py-2">{worker.role}</td>
                  <td className="px-4 py-2">{worker.payType}</td>
                  <td className="px-4 py-2">{formatCurrency(worker.payRate)}</td>
                  <td className="px-4 py-2">{formatCurrency(worker.loans)}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${worker.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {worker.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <button onClick={() => onNavigate('workerDetails', worker.id)} className="text-blue-500 hover:underline">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Worker Detail Page
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
            <input type="number" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" />
          </div>
          <div>
            <label className="block text-gray-700">Description</label>
            <input type="text" value={loanDescription} onChange={(e) => setLoanDescription(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" />
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
            <input type="number" value={deductAmount} onChange={(e) => setDeductAmount(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" />
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

// Financials Page
const Financials = ({ data }) => {
  const [newRevenue, setNewRevenue] = useState({ description: '', amount: '', cropId: '' });
  const [newExpense, setNewExpense] = useState({ description: '', amount: '', cropId: '' });

  const handleAddRevenue = (e) => {
    e.preventDefault();
    // Logic to add revenue
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    // Logic to add expense
  };

  const revenueBreakdown = data.financials.filter(t => t.type === 'Revenue').reduce((acc, curr) => {
    const crop = acc.find(item => item.name === curr.crop);
    if (crop) {
      crop.value += curr.amount;
    } else {
      acc.push({ name: curr.crop, value: curr.amount });
    }
    return acc;
  }, []);

  const expenseBreakdown = data.financials.filter(t => t.type === 'Expense').reduce((acc, curr) => {
    const desc = acc.find(item => item.name === curr.description);
    if (desc) {
      desc.value += curr.amount;
    } else {
      acc.push({ name: curr.description, value: curr.amount });
    }
    return acc;
  }, []);

  return (
    <div className="p-8 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-500">Total Revenue</h3>
            <p className="text-3xl font-bold text-green-600">{formatCurrency(data.financials.filter(t => t.type === 'Revenue').reduce((sum, t) => sum + t.amount, 0))}</p>
          </div>
          <span className="text-4xl">💲</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-500">Total Expenses</h3>
            <p className="text-3xl font-bold text-red-600">{formatCurrency(data.financials.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0))}</p>
          </div>
          <span className="text-4xl">💸</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold mb-4">Revenue Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={revenueBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                {revenueBreakdown.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold mb-4">Expense Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={expenseBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#82ca9d" label>
                {expenseBreakdown.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-xl font-bold mb-4">Transaction History</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-gray-600">Date</th>
                <th className="px-4 py-2 text-left text-gray-600">Type</th>
                <th className="px-4 py-2 text-left text-gray-600">Description</th>
                <th className="px-4 py-2 text-left text-gray-600">Amount</th>
                <th className="px-4 py-2 text-left text-gray-600">Linked to Crop</th>
              </tr>
            </thead>
            <tbody>
              {data.financials.map((transaction) => (
                <tr key={transaction.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-2">{formatDate(transaction.date)}</td>
                  <td className={`px-4 py-2 ${transaction.type === 'Revenue' ? 'text-green-600' : 'text-red-600'}`}>{transaction.type}</td>
                  <td className="px-4 py-2">{transaction.description}</td>
                  <td className="px-4 py-2">{formatCurrency(transaction.amount)}</td>
                  <td className="px-4 py-2">{transaction.crop || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Inventory Management Page
const Inventory = ({ data }) => (
  <div className="p-8 space-y-8">
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Current Inventory</h3>
        <button className="bg-green-500 text-white p-3 rounded-xl shadow-md hover:bg-green-600 transition">
          <div className="flex items-center space-x-2">
            <span className="text-xl">➕</span>
            <span>Add New Item</span>
          </div>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-gray-600">Item Name</th>
              <th className="px-4 py-2 text-left text-gray-600">Type</th>
              <th className="px-4 py-2 text-left text-gray-600">Quantity</th>
              <th className="px-4 py-2 text-left text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.inventory.map((item) => (
              <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-2">{item.itemName}</td>
                <td className="px-4 py-2">{item.itemType}</td>
                <td className="px-4 py-2">{item.quantity} {item.unit}</td>
                <td className="px-4 py-2">
                  <button className="text-blue-500 hover:underline">Edit</button>
                  <button className="text-red-500 hover:underline ml-4">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// Reports & Analytics Page
const Reports = ({ data }) => (
  <div className="p-8 space-y-8">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-xl font-bold mb-4">Financial Reports</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.financialTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#82ca9d" name="Revenue" />
            <Line type="monotone" dataKey="expenses" stroke="#ff7300" name="Expenses" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-xl font-bold mb-4">Yield Reports</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={data.yields} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
              {data.yields.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>

    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h3 className="text-xl font-bold mb-4">Profitability by Crop</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data.profitability}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="profit" fill="#82ca9d" name="Profit" />
          <Bar dataKey="loss" fill="#ff7300" name="Loss" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);


// Main App Component
const App = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const [data, setData] = useState({
    user: { id: 'user_1a2b3c4d' },
    dashboard: { financialSummary: { totalRevenue: 0, totalExpenses: 0 }, metrics: { totalYield: 0, activeWorkers: 0 }, financialTrends: [], weather: {} },
    yields: [],
    sales: [],
    workers: [],
    workerAttendance: {},
    workerLoans: {},
    financials: [],
    inventory: [],
    reports: { yields: [], profitability: [] }
  });
  const [loading, setLoading] = useState(true);
  const [selectedWorkerId, setSelectedWorkerId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const dashboardRes = await fetch('http://localhost:5000/api/dashboard');
      const dashboardData = await dashboardRes.json();
      
      const yieldsRes = await fetch('http://localhost:5000/api/yields');
      const yieldsData = await yieldsRes.json();
      
      const salesRes = await fetch('http://localhost:5000/api/sales');
      const salesData = await salesRes.json();
      
      const workersRes = await fetch('http://localhost:5000/api/workers');
      const workersData = await workersRes.json();

      const financialsRes = await fetch('http://localhost:5000/api/financials');
      const financialsData = await financialsRes.json();

      const inventoryRes = await fetch('http://localhost:5000/api/inventory');
      const inventoryData = await inventoryRes.json();
      
      const userIdRes = await fetch('http://localhost:5000/api/auth/user-id');
      const userIdData = await userIdRes.json();

      const calculatedYieldReports = yieldsData.map(y => ({ name: y.cropName, value: y.quantity }));
      
      // Simplified profitability calculation for demo
      const profitabilityMap = {};
      financialsData.forEach(f => {
        if (f.crop) {
          if (!profitabilityMap[f.crop]) {
            profitabilityMap[f.crop] = { profit: 0, loss: 0 };
          }
          if (f.type === 'Revenue') {
            profitabilityMap[f.crop].profit += f.amount;
          } else {
            profitabilityMap[f.crop].loss += f.amount;
          }
        }
      });
      const calculatedProfitabilityReports = Object.keys(profitabilityMap).map(crop => ({
        name: crop,
        profit: profitabilityMap[crop].profit,
        loss: profitabilityMap[crop].loss
      }));

      setData(prevData => ({
        ...prevData,
        user: { id: userIdData.userId },
        dashboard: { ...dashboardData, weather: { temp: '30°C', windSpeed: '10 km/h', humidity: '75%', condition: 'Sunny', forecast: '5 Day Forecast' } },
        yields: yieldsData,
        sales: salesData,
        workers: workersData,
        financials: financialsData,
        inventory: inventoryData,
        reports: {
          yields: calculatedYieldReports,
          profitability: calculatedProfitabilityReports,
        }
      }));
    } catch (error) {
      console.error("Failed to fetch data:", error);
      console.error("Please ensure your Python backend is running on http://localhost:5000 and the PostgreSQL database is configured correctly.");
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkerDetails = async (workerId) => {
    try {
        const res = await fetch(`http://localhost:5000/api/workers/${workerId}`);
        const data = await res.json();
        const worker = data.worker;
        const attendance = data.attendance;
        const loans = data.loans;
        setData(prevData => ({
          ...prevData,
          workers: prevData.workers.map(w => w.id === workerId ? worker : w),
          workerAttendance: { ...prevData.workerAttendance, [workerId]: attendance },
          workerLoans: { ...prevData.workerLoans, [workerId]: loans },
        }));
    } catch (error) {
        console.error("Failed to fetch worker details:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleNavigate = (page, workerId = null) => {
    setActivePage(page);
    setSelectedWorkerId(workerId);
    if (page === 'workerDetails' && workerId !== null) {
      fetchWorkerDetails(workerId);
    }
  };

  const handleAddYield = async (newYield) => {
    try {
      const response = await fetch('http://localhost:5000/api/yields', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newYield),
      });
      if (response.ok) {
        fetchData();
      } else {
        console.error("Failed to add yield");
      }
    } catch (error) {
      console.error("Error adding yield:", error);
    }
  };

  const handleRecordSale = async (newSale) => {
    try {
      const response = await fetch('http://localhost:5000/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSale),
      });
      if (response.ok) {
        fetchData();
      } else {
        console.error("Failed to record sale");
      }
    } catch (error) {
      console.error("Error recording sale:", error);
    }
  };

  const handleAddWorker = async (newWorker) => {
    try {
      const response = await fetch('http://localhost:5000/api/workers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWorker),
      });
      if (response.ok) {
        fetchData();
      } else {
        console.error("Failed to add worker");
      }
    } catch (error) {
      console.error("Error adding worker:", error);
    }
  };

  const handleMarkAttendance = async (workerId, date, status, hours) => {
    try {
        const response = await fetch(`http://localhost:5000/api/workers/${workerId}/attendance`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date, status, hours }),
        });
        if (response.ok) {
            fetchWorkerDetails(workerId);
        } else {
            console.error("Failed to update attendance");
        }
    } catch (error) {
        console.error("Error updating attendance:", error);
    }
};

const handleUpdateLoan = async (workerId, amount, description, type) => {
    const payload = { amount, description };
    try {
        const response = await fetch(`http://localhost:5000/api/workers/${workerId}/loan`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (response.ok) {
            fetchWorkerDetails(workerId);
        } else {
            console.error("Failed to update loan");
        }
    } catch (error) {
        console.error("Error updating loan:", error);
    }
};

const handleCalculatePay = async (workerId, deduction) => {
    try {
        const response = await fetch(`http://localhost:5000/api/workers/${workerId}/payroll`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ deduction: parseInt(deduction) || 0 }),
        });
        const data = await response.json();
        if (response.ok) {
            console.log("Payroll processed:", data);
            fetchWorkerDetails(workerId);
            fetchData();
        } else {
            console.error("Failed to calculate pay", data);
        }
    } catch (error) {
        console.error("Error calculating pay:", error);
    }
};


  const renderPage = () => {
    if (loading) {
      return <div className="p-8 text-center text-gray-500">Loading data...</div>;
    }

    switch (activePage) {
      case 'dashboard':
        return <Dashboard data={data.dashboard} />;
      case 'yields':
        return <YieldsSales data={{ yields: data.yields, sales: data.sales }} onAddYield={handleAddYield} onRecordSale={handleRecordSale} />;
      case 'workers':
        return <WorkerManagement data={{ workers: data.workers }} onAddWorker={handleAddWorker} onNavigate={handleNavigate} />;
      case 'workerDetails':
        const worker = data.workers.find(w => w.id === selectedWorkerId);
        if (!worker) return <div className="p-8">Worker not found.</div>;
        return (
          <WorkerDetails
            worker={worker}
            attendance={data.workerAttendance[selectedWorkerId] || {}}
            loans={data.workerLoans[selectedWorkerId] || []}
            onMarkAttendance={handleMarkAttendance}
            onUpdateLoan={handleUpdateLoan}
            onCalculatePay={handleCalculatePay}
            onNavigate={handleNavigate}
          />
        );
      case 'financials':
        return <Financials data={{ financials: data.financials, yields: data.yields }} />;
      case 'inventory':
        return <Inventory data={{ inventory: data.inventory }} />;
      case 'reports':
        return <Reports data={{ financialTrends: data.dashboard.financialTrends, yields: data.reports.yields, profitability: data.reports.profitability }} />;
      default:
        return <Dashboard data={data.dashboard} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex space-x-8 font-sans antialiased">
      <style>{`
        body {
          margin: 0;
        }
      `}</style>
      <Sidebar activePage={activePage} onNavigate={handleNavigate} />
      <div className="flex-1 flex flex-col rounded-2xl shadow-xl overflow-hidden">
        <TopBar title={activePage.charAt(0).toUpperCase() + activePage.slice(1).replace(/([A-Z])/g, ' $1').trim()} userId={data.user.id} />
        <main className="flex-1 bg-gray-50 overflow-y-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default App;
