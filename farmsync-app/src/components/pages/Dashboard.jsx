import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/formatters';

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

export default Dashboard;
