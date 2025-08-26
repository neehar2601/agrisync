// Dashboard metrics cards component
import React from 'react';
import { StatsCard } from '../../shared/components/Card';
import { formatCurrency, formatNumber } from '../../shared/utils/formatters';

const DashboardMetrics = ({ data }) => {
  const metrics = [
    {
      title: 'Total Revenue',
      value: formatCurrency(data.financialSummary?.totalRevenue || 0),
      icon: '💲',
      color: 'text-green-600'
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(data.financialSummary?.totalExpenses || 0),
      icon: '💸',
      color: 'text-red-600'
    },
    {
      title: 'Total Yield',
      value: `${formatNumber(data.metrics?.totalYield || 0)} kg`,
      icon: '🌾',
      color: 'text-yellow-600'
    },
    {
      title: 'Active Workers',
      value: formatNumber(data.metrics?.activeWorkers || 0),
      icon: '👥',
      color: 'text-blue-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <StatsCard
          key={index}
          title={metric.title}
          value={metric.value}
          icon={metric.icon}
          color={metric.color}
        />
      ))}
    </div>
  );
};

export default DashboardMetrics;
