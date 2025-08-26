// Financial overview component
import React from 'react';
import { StatsCard } from '../../shared/components/Card';
import { formatCurrency } from '../../shared/utils/formatters';
import { FINANCIAL_TYPES } from '../../shared/utils/constants';

const FinancialOverview = ({ financials }) => {
  const totalRevenue = financials
    .filter(f => f.type === FINANCIAL_TYPES.REVENUE)
    .reduce((sum, f) => sum + f.amount, 0);

  const totalExpenses = financials
    .filter(f => f.type === FINANCIAL_TYPES.EXPENSE)
    .reduce((sum, f) => sum + f.amount, 0);

  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : 0;

  const stats = [
    {
      title: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      icon: '💲',
      color: 'text-green-600'
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(totalExpenses),
      icon: '💸',
      color: 'text-red-600'
    },
    {
      title: 'Net Profit',
      value: formatCurrency(netProfit),
      icon: netProfit >= 0 ? '📈' : '📉',
      color: netProfit >= 0 ? 'text-green-600' : 'text-red-600'
    },
    {
      title: 'Profit Margin',
      value: `${profitMargin}%`,
      icon: '📊',
      color: netProfit >= 0 ? 'text-blue-600' : 'text-red-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatsCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
        />
      ))}
    </div>
  );
};

export default FinancialOverview;
