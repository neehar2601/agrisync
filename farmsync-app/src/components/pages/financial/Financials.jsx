import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { COLORS, formatCurrency } from '../../../utils/formatters';

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
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Financials;
