// Worker statistics component
import React from 'react';
import { StatsCard } from '../../shared/components/Card';
import { formatCurrency, formatNumber } from '../../shared/utils/formatters';

const WorkerStats = ({ workers }) => {
  const totalWorkers = workers.length;
  const activeWorkers = workers.filter(w => w.active).length;
  const totalLoans = workers.reduce((sum, w) => sum + w.loans, 0);
  const pendingPayments = totalLoans; // Simplified calculation

  const stats = [
    {
      title: 'Total Workers',
      value: formatNumber(totalWorkers),
      icon: '👥',
      color: 'text-gray-800'
    },
    {
      title: 'Active Workers',
      value: formatNumber(activeWorkers),
      icon: '✅',
      color: 'text-green-600'
    },
    {
      title: 'Pending Payments',
      value: formatCurrency(pendingPayments),
      icon: '⏳',
      color: 'text-yellow-600'
    },
    {
      title: 'Loan Balances',
      value: formatCurrency(totalLoans),
      icon: '💸',
      color: 'text-red-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

export default WorkerStats;
