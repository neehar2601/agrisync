// Financial trends chart component
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '../../shared/components/Card';

const FinancialTrendsChart = ({ data }) => {
  return (
    <Card title="Financial Trends" className="lg:col-span-2">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="revenue" stroke="#82ca9d" name="Revenue" />
          <Line type="monotone" dataKey="expenses" stroke="#ff7300" name="Expenses" />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default FinancialTrendsChart;
