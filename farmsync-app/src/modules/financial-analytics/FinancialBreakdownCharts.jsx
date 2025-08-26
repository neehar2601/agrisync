// Financial breakdown charts component
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card } from '../../shared/components/Card';
import { COLORS, FINANCIAL_TYPES } from '../../shared/utils/constants';

const FinancialBreakdownCharts = ({ financials }) => {
  // Process revenue breakdown by crop
  const revenueBreakdown = financials
    .filter(f => f.type === FINANCIAL_TYPES.REVENUE)
    .reduce((acc, curr) => {
      const crop = curr.crop || 'Other';
      const existing = acc.find(item => item.name === crop);
      if (existing) {
        existing.value += curr.amount;
      } else {
        acc.push({ name: crop, value: curr.amount });
      }
      return acc;
    }, []);

  // Process expense breakdown by description
  const expenseBreakdown = financials
    .filter(f => f.type === FINANCIAL_TYPES.EXPENSE)
    .reduce((acc, curr) => {
      const category = curr.description.includes('salary') ? 'Salaries' :
                     curr.description.includes('Loan') ? 'Loans' : 'Other Expenses';
      const existing = acc.find(item => item.name === category);
      if (existing) {
        existing.value += curr.amount;
      } else {
        acc.push({ name: category, value: curr.amount });
      }
      return acc;
    }, []);

  const renderPieChart = (data, title) => (
    <Card title={title}>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-300 flex items-center justify-center text-gray-500">
          No data available
        </div>
      )}
    </Card>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {renderPieChart(revenueBreakdown, 'Revenue Breakdown')}
      {renderPieChart(expenseBreakdown, 'Expense Breakdown')}
    </div>
  );
};

export default FinancialBreakdownCharts;
