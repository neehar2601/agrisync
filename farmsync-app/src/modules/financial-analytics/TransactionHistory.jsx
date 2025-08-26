// Transaction history component
import React from 'react';
import { Card } from '../../shared/components/Card';
import { Table, StatusBadge } from '../../shared/components/Table';
import { formatCurrency, formatDate } from '../../shared/utils/formatters';
import { FINANCIAL_TYPES } from '../../shared/utils/constants';

const TransactionHistory = ({ financials }) => {
  const columns = [
    {
      header: 'Date',
      key: 'date',
      render: (value) => formatDate(value)
    },
    {
      header: 'Type',
      key: 'type',
      render: (value) => (
        <StatusBadge
          status={value}
          variant={value === FINANCIAL_TYPES.REVENUE ? 'success' : 'danger'}
        />
      )
    },
    {
      header: 'Description',
      key: 'description'
    },
    {
      header: 'Amount',
      key: 'amount',
      render: (value, row) => (
        <span className={row.type === FINANCIAL_TYPES.REVENUE ? 'text-green-600' : 'text-red-600'}>
          {formatCurrency(value)}
        </span>
      )
    },
    {
      header: 'Linked to Crop',
      key: 'crop',
      render: (value) => value || 'N/A'
    }
  ];

  // Sort by date (newest first)
  const sortedFinancials = [...financials].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <Card title="Transaction History">
      <Table
        columns={columns}
        data={sortedFinancials}
        emptyMessage="No transactions recorded yet"
      />
    </Card>
  );
};

export default TransactionHistory;
