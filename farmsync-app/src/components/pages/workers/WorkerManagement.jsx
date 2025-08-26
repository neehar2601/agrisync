import React from 'react';
import { formatCurrency } from '../../../utils/formatters';

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

export default WorkerManagement;
